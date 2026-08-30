"""SQLAlchemy models.

Journal-specific models will be defined here. For now this module only re-exports
``Base`` so ``init_db`` has something to import.
"""

from app.database import Base

__all__ = ["Base"]
