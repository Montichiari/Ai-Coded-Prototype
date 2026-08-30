# Journal Application

A journal app. Currently just the skeleton — a React (Vite) frontend and a FastAPI backend
with a health check. No journal features yet.

## Stack

- **Frontend:** React + Vite + TypeScript (`/frontend`)
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
API docs at http://localhost:8000/docs.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Serves on http://localhost:5173.
