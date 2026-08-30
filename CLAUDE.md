# CLAUDE.md

Monorepo skeleton for a journal application. Two halves: `frontend/` (React + Vite +
TypeScript) and `backend/` (FastAPI + async SQLAlchemy + SQLite). No journal-specific
features yet — the backend exposes only a health check and the frontend is the default
Vite starter.

## Structure

```
frontend/            React + Vite + TypeScript app (default starter, untouched)
  src/App.tsx        root component
  src/main.tsx       entry point
  vite.config.ts     Vite config
backend/
  pyproject.toml     uv-managed dependencies + project config
  uv.lock            locked dependency versions
  app/
    main.py          FastAPI app: CORS middleware, lifespan -> init_db, GET /health
    config.py        Settings (pydantic-settings): database_url, cors_origins
    database.py      async engine, async_sessionmaker, Base, get_db(), init_db()
    models/          SQLAlchemy models (placeholder; currently re-exports Base)
```

## Dev commands

### Backend (run from `backend/`, requires [uv](https://docs.astral.sh/uv/))

| Task | Command |
| --- | --- |
| Install deps | `uv sync` |
| Run dev server | `uv run uvicorn app.main:app --reload` (serves http://localhost:8000) |
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
- **New models** go in `app/models/` and must be imported before `init_db()` runs — it
  imports the `app.models` package for exactly this reason (see `app/database.py`).
- **`journal.db`** is created on backend startup and is gitignored. Delete it to reset local
  data.
- **Config** is env-overridable via `backend/.env` (keys: `database_url`, `cors_origins`).
- **CORS.** `http://localhost:5173` (the frontend dev server) is the default allowed origin.
