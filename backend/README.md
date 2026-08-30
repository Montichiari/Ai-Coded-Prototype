# Journal Backend

FastAPI service with an async SQLAlchemy + SQLite data layer. Skeleton only — the sole
endpoint is `GET /health`.

## Setup

```bash
uv sync
```

## Run

```bash
uv run uvicorn app.main:app --reload
```

- API: http://localhost:8000
- Health check: http://localhost:8000/health
- Docs: http://localhost:8000/docs

## Layout

```
app/
  config.py     # settings (database URL, CORS origins)
  database.py   # async engine, session factory, Base, get_db dependency
  main.py       # FastAPI app + /health
  models/       # SQLAlchemy models go here (empty for now)
```
