import os
import shutil
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
BUNDLED_DB = BASE_DIR / "data" / "influence.db"


def normalize_database_url(url: str | None) -> str | None:
    if not url:
        return None
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    return url


def resolve_sqlite_path() -> Path:
    env_url = os.getenv("DATABASE_URL")
    if env_url and env_url.startswith("sqlite"):
        raw = env_url.replace("sqlite:///", "", 1)
        return Path(raw)

    if os.getenv("VERCEL"):
        tmp = Path("/tmp/influence.db")
        if not tmp.exists() and BUNDLED_DB.exists():
            shutil.copy(BUNDLED_DB, tmp)
        return tmp

    BUNDLED_DB.parent.mkdir(parents=True, exist_ok=True)
    return BUNDLED_DB


DB_PATH = resolve_sqlite_path()
SQLALCHEMY_DATABASE_URL = normalize_database_url(os.getenv("DATABASE_URL")) or f"sqlite:///{DB_PATH.as_posix()}"
IS_POSTGRES = SQLALCHEMY_DATABASE_URL.startswith("postgresql")

if IS_POSTGRES:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        poolclass=NullPool,
        pool_pre_ping=True,
    )
else:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
