from datetime import date

from httpx import AsyncClient


async def _create(client: AsyncClient, **overrides) -> dict:
    payload = {"title": "A day", "body": "Something happened."}
    payload.update(overrides)
    resp = await client.post("/entries", json=payload)
    assert resp.status_code == 201, resp.text
    return resp.json()


async def test_create_returns_201_and_echoes_fields(client: AsyncClient):
    resp = await client.post(
        "/entries",
        json={"entry_date": "2026-01-15", "title": "First", "body": "Hello"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["id"] > 0
    assert data["entry_date"] == "2026-01-15"
    assert data["title"] == "First"
    assert data["body"] == "Hello"


async def test_create_without_date_defaults_to_today(client: AsyncClient):
    data = await _create(client)
    assert data["entry_date"] == date.today().isoformat()


async def test_create_missing_title_is_422(client: AsyncClient):
    resp = await client.post("/entries", json={"body": "no title"})
    assert resp.status_code == 422


async def test_create_blank_title_is_422(client: AsyncClient):
    resp = await client.post("/entries", json={"title": "   ", "body": "x"})
    assert resp.status_code == 422


async def test_create_empty_body_allowed(client: AsyncClient):
    data = await _create(client, body="")
    assert data["body"] == ""


async def test_title_is_stripped(client: AsyncClient):
    data = await _create(client, title="  Padded  ")
    assert data["title"] == "Padded"


async def test_list_is_newest_first_by_date_then_id(client: AsyncClient):
    mid = await _create(client, entry_date="2026-05-10", title="mid")
    old = await _create(client, entry_date="2026-05-01", title="old")
    new = await _create(client, entry_date="2026-05-20", title="new")
    same_day = await _create(client, entry_date="2026-05-20", title="new-2")

    resp = await client.get("/entries")
    assert resp.status_code == 200
    ids = [e["id"] for e in resp.json()]
    # 2026-05-20 entries first (later id before earlier id), then mid, then old
    assert ids == [same_day["id"], new["id"], mid["id"], old["id"]]


async def test_get_by_id(client: AsyncClient):
    created = await _create(client)
    resp = await client.get(f"/entries/{created['id']}")
    assert resp.status_code == 200
    assert resp.json() == created


async def test_get_unknown_id_is_404(client: AsyncClient):
    resp = await client.get("/entries/999")
    assert resp.status_code == 404


async def test_update_changes_fields(client: AsyncClient):
    created = await _create(client)
    resp = await client.put(
        f"/entries/{created['id']}",
        json={"entry_date": "2026-02-02", "title": "Updated", "body": "New body"},
    )
    assert resp.status_code == 200

    fetched = (await client.get(f"/entries/{created['id']}")).json()
    assert fetched["entry_date"] == "2026-02-02"
    assert fetched["title"] == "Updated"
    assert fetched["body"] == "New body"


async def test_update_unknown_id_is_404(client: AsyncClient):
    resp = await client.put(
        "/entries/999",
        json={"entry_date": "2026-02-02", "title": "x", "body": ""},
    )
    assert resp.status_code == 404


async def test_update_blank_title_is_422(client: AsyncClient):
    created = await _create(client)
    resp = await client.put(
        f"/entries/{created['id']}",
        json={"entry_date": "2026-02-02", "title": "  ", "body": ""},
    )
    assert resp.status_code == 422


async def test_delete_then_get_is_404(client: AsyncClient):
    created = await _create(client)
    resp = await client.delete(f"/entries/{created['id']}")
    assert resp.status_code == 204

    assert (await client.get(f"/entries/{created['id']}")).status_code == 404


async def test_delete_unknown_id_is_404(client: AsyncClient):
    resp = await client.delete("/entries/999")
    assert resp.status_code == 404


async def test_created_entry_persists_in_list(client: AsyncClient):
    created = await _create(client, title="Persisted")
    listed = (await client.get("/entries")).json()
    assert any(e["id"] == created["id"] and e["title"] == "Persisted" for e in listed)
