from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import schemas
from app.database import get_db
from app.models.entry import Entry

router = APIRouter(prefix="/entries", tags=["entries"])


async def _get_or_404(entry_id: int, db: AsyncSession) -> Entry:
    entry = await db.get(Entry, entry_id)
    if entry is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    return entry


@router.get("", response_model=list[schemas.EntryRead])
async def list_entries(db: AsyncSession = Depends(get_db)) -> list[Entry]:
    result = await db.execute(
        select(Entry).order_by(Entry.entry_date.desc(), Entry.id.desc())
    )
    return list(result.scalars().all())


@router.post("", response_model=schemas.EntryRead, status_code=status.HTTP_201_CREATED)
async def create_entry(
    payload: schemas.EntryCreate, db: AsyncSession = Depends(get_db)
) -> Entry:
    entry = Entry(**payload.model_dump())
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.get("/{entry_id}", response_model=schemas.EntryRead)
async def get_entry(entry_id: int, db: AsyncSession = Depends(get_db)) -> Entry:
    return await _get_or_404(entry_id, db)


@router.put("/{entry_id}", response_model=schemas.EntryRead)
async def update_entry(
    entry_id: int, payload: schemas.EntryUpdate, db: AsyncSession = Depends(get_db)
) -> Entry:
    entry = await _get_or_404(entry_id, db)
    for field, value in payload.model_dump().items():
        setattr(entry, field, value)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(entry_id: int, db: AsyncSession = Depends(get_db)) -> None:
    entry = await _get_or_404(entry_id, db)
    await db.delete(entry)
    await db.commit()
