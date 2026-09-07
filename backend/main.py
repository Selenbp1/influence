from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import Base, engine, get_db
from routers import auth, backup, campaigns, influencers, inquiries, portfolio, settings, stats, uploads
from routers.uploads import UPLOAD_DIR
from seed import seed_if_empty

Base.metadata.create_all(bind=engine)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="INFLUENCE API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(influencers.router, prefix="/api")
app.include_router(campaigns.router, prefix="/api")
app.include_router(portfolio.router, prefix="/api")
app.include_router(inquiries.router, prefix="/api")
app.include_router(stats.router, prefix="/api")
app.include_router(settings.router, prefix="/api")
app.include_router(uploads.router, prefix="/api")
app.include_router(backup.router, prefix="/api")
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.on_event("startup")
def on_startup():
    db = next(get_db())
    try:
        seed_if_empty(db)
    finally:
        db.close()


@app.get("/api/health")
def health():
    return {"ok": True, "service": "influence-api"}
