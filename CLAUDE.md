# CLAUDE.md

Monorepo for a journal application. Two halves: `frontend/` (React + Vite + TypeScript)
and `backend/` (FastAPI + async SQLAlchemy + SQLite). One feature so far: CRUD for journal
entries (date, title, body) — see `specs/journal-entries-crud.md`.

## Structure

```
frontend/            React + Vite + TypeScript app
  src/main.tsx       entry point (wraps <App/> in <BrowserRouter>)
  src/App.tsx        app shell + route table
  src/api.ts         typed fetch client for the backend (base URL from VITE_API_URL)
  src/types.ts       Entry / EntryInput types
  src/format.ts      date formatting + body-preview helpers
  src/components/     EntryTile, EntryForm (shared create/edit)
  src/pages/          EntryListPage, EntryDetailPage, EntryNewPage, EntryEditPage
  vite.config.ts     Vite config
backend/
  pyproject.toml     uv-managed dependencies (+ dev group) + pytest config
  uv.lock            locked dependency versions
  app/
    main.py          FastAPI app: CORS, lifespan -> init_db, GET /health, entries router
    config.py        Settings (pydantic-settings): database_url, cors_origins
    database.py      async engine, async_sessionmaker, Base, get_db(), init_db()
    schemas.py       Pydantic request/response models (EntryCreate/Update/Read)
    models/          SQLAlchemy models — entry.py (Entry); __init__ imports them all
    routers/         APIRouters — entries.py (/entries CRUD)
  tests/             pytest suite (async httpx client against an in-memory DB)
```

## API

- `GET /health` -> `{"status":"ok"}`
- `GET /entries` — all entries, newest first (`entry_date` desc, then `id` desc)
- `POST /entries` — create; `entry_date` defaults to today if omitted; blank `title` -> 422
- `GET /entries/{id}` — one entry, 404 if missing
- `PUT /entries/{id}` — full replace (all three fields), 404 if missing
- `DELETE /entries/{id}` — 204, 404 if missing

## Dev commands

### Backend (run from `backend/`, requires [uv](https://docs.astral.sh/uv/))

| Task | Command |
| --- | --- |
| Install deps | `uv sync` |
| Run dev server | `uv run uvicorn app.main:app --reload` (serves http://localhost:8000) |
| Run tests | `uv run pytest` |
| Health check | `curl http://localhost:8000/health` -> `{"status":"ok"}` |
| API docs | open http://localhost:8000/docs |

### Frontend (run from `frontend/`, requires Node + npm)

| Task | Command |
| --- | --- |
| Install deps | `npm install` |
| Run dev server | `npm run dev` (serves http://localhost:5173) |
| Type-check + build | `npm run build` (`tsc -b && vite build`) |
| Lint | `npm run lint` (oxlint) |
| Preview build | `npm run preview` |

## Conventions

- **Async DB layer.** The database uses `sqlite+aiosqlite`. Use the `get_db` dependency from
  `app/database.py` for request-scoped `AsyncSession`s.
- **New models** go in `app/models/` as their own module and must be imported in
  `app/models/__init__.py` so `init_db()` registers them before `create_all` (no Alembic —
  schema is created from the models on startup).
- **New endpoints** go in an `APIRouter` under `app/routers/`, included from `app/main.py`.
- **`journal.db`** is created on backend startup and is gitignored. Since there are no
  migrations, delete it after a model change to pick up the new schema.
- **Config** is env-overridable via `backend/.env` (keys: `database_url`, `cors_origins`).
- **CORS.** `http://localhost:5173` (the frontend dev server) is the default allowed origin.
- **Frontend ↔ backend.** All calls go through `src/api.ts`; it reads `VITE_API_URL` and
  falls back to `http://localhost:8000`. Routing is client-side (`react-router-dom`), so a
  static deploy needs an SPA fallback to `index.html`.
