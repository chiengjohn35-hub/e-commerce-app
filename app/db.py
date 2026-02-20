from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Database URL for local development using SQLite. Change to use PostgreSQL in production.
SQLALCHEMY_DATABASE_URL = "sqlite:///./app2.db"

# Create the SQLAlchemy engine. For SQLite we need check_same_thread=False for multithreading.
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Session factory: create a new Session for each request via dependency.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base class for models to inherit from.
Base = declarative_base()


def get_db():
    """Dependency that yields a DB session and ensures it is closed afterwards.

    Usage in FastAPI endpoints: `db: Session = Depends(get_db)`.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize the DB schema (for development).

    This imports the models so they are registered on `Base.metadata` then
    creates tables. In production use Alembic for migrations instead.
    """
    # Import models so they are registered with Base.metadata
    from . import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
