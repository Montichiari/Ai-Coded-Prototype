from datetime import date

from pydantic import BaseModel, ConfigDict, Field, field_validator


class EntryBase(BaseModel):
    entry_date: date
    title: str
    body: str = ""

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("title must not be empty")
        return value


class EntryCreate(EntryBase):
    entry_date: date = Field(default_factory=date.today)


class EntryUpdate(EntryBase):
    pass


class EntryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    entry_date: date
    title: str
    body: str
