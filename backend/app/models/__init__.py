"""SQLAlchemy models.

Every model must be imported here so that ``init_db`` (which imports this package)
registers it on ``Base.metadata`` before ``create_all`` runs.
"""

from app.database import Base
from app.models.entry import Entry

__all__ = ["Base", "Entry"]
