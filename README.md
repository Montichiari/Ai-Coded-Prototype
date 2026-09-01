# Journal Application

A journal app with CRUD for journal entries — each entry has a date, title, and body.
The React frontend lists entries as newest-first tiles, opens a full detail view on click,
and supports create / edit / delete (delete behind a confirmation). The FastAPI backend
exposes the entries as a REST API backed by SQLite.

## Stack

- **Frontend:** React + Vite + TypeScript, `react-router-dom` (`/frontend`)
- **Backend:** FastAPI + async SQLAlchemy + SQLite (`/backend`)

## Prerequisites

- Node.js + npm
- Python 3.12+ and [uv](https://docs.astral.sh/uv/)

## Running

### Backend

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload
```

Serves on http://localhost:8000 — health check at http://localhost:8000/health,
API docs at http://localhost:8000/docs. The SQLite database (`journal.db`) is created
on startup.

Run the tests with `uv run pytest`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Serves on http://localhost:5173. The backend must be running for the app to load entries;
the API base URL can be overridden with `VITE_API_URL`.

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | `{"status": "ok"}` |
| `GET` | `/entries` | All entries, newest first |
| `POST` | `/entries` | Create an entry (`entry_date` defaults to today; blank title → 422) |
| `GET` | `/entries/{id}` | One entry (404 if missing) |
| `PUT` | `/entries/{id}` | Full replace of date, title, body (404 if missing) |
| `DELETE` | `/entries/{id}` | Delete an entry (204; 404 if missing) |

See `CLAUDE.md` for project structure and conventions, and `specs/journal-entries-crud.md`
for the feature spec.
