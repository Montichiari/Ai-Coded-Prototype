---
name: implement-spec
description: Use when asked to implement, build, or start work on a feature spec from the specs/ folder. Covers branching, implementation order, and stopping points.
---

When implementing a spec from `specs/`:

1. Create a branch named `feature/<spec-filename-without-extension>` off main
   (e.g. specs/entries-crud.md → feature/entries-crud)
2. Read the full spec before writing any code — requirements, constraints,
   acceptance criteria, and edge cases all matter, not just the requirements list
3. If the spec touches both backend and frontend, implement and stop for review
   after the backend before starting the frontend — don't do both in one pass
4. Do not commit automatically. Implement, then stop and summarize what was
   built against the spec's acceptance criteria, and wait for explicit
   approval before committing
5. Do not add anything not listed in Requirements — if something seems
   missing or ambiguous, ask rather than assume
