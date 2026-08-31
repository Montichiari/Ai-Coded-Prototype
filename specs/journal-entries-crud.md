# Spec: Journal Entries (Core CRUD)

## One-line goal

A user can create, view, edit, and delete journal entries, each with a date, title, and text body, and browse saved entries as clickable summary tiles.

## Requirements

- A user can create a new entry with a date, a title, and a text body
- A user can view all saved entries as a grid/list of tiles
- Each tile shows the entry's date, title, and a short preview of the body text
- Clicking a tile opens the full entry (date, title, complete body text)
- A user can edit an existing entry's date, title, or body
- A user can delete an entry

## Constraints

- No tags, mood score, or any field beyond date/title/body in this version
- No search or filtering yet — tiles show all entries, most recent first
- No auth — single-user, local only (matches current project stage)
- Deleting an entry is permanent — no trash/undo in this version

## Acceptance criteria

- [ ] Creating an entry and reloading the app shows it in the tile view
- [ ] Tile preview shows a truncated snippet of the body, not the full text
- [ ] Clicking a tile navigates to a detail view showing the complete entry
- [ ] Editing an entry's title or body updates what's shown in both the tile and detail view
- [ ] Deleting an entry removes it from the tile view and it does not reappear on reload
- [ ] Entries are ordered newest-first by date

## Edge cases

- Empty title → not allowed; require at least a title before saving (prevents a wall of identical "untitled" tiles)
- Empty body → allowed; tile shows the title only, with no preview line
- Body text shorter than the preview length → tile shows the full body, no truncation ellipsis
- Very long title → truncate on the tile with an ellipsis; full title still shown in detail view
- Date field → defaults to today at creation time, but user can change it (so a user can log a past day's entry)
- Deleting an entry → require a confirmation step before it's permanent, given there's no undo

## Depends on / touches

- None — this is the first real feature. It establishes the entry data model that tags, mood tracking, and export will all build on later, so it's worth getting the core fields and API shape right now rather than reworking them under a future feature's pressure.

## Status

Draft
