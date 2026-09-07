from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from models import Campaign, Influencer, Inquiry, Portfolio, SiteSetting

router = APIRouter(prefix="/backup", tags=["backup"], dependencies=[Depends(require_admin)])


def dump_item(item) -> dict:
    data = {column.name: getattr(item, column.name) for column in item.__table__.columns}
    if "created_at" in data and data["created_at"] is not None:
        data["created_at"] = data["created_at"].isoformat()
    return data


@router.get("")
def export_backup(db: Session = Depends(get_db)):
    setting = db.query(SiteSetting).first()
    payload = {
        "influencers": [dump_item(item) for item in db.query(Influencer).all()],
        "campaigns": [dump_item(item) for item in db.query(Campaign).all()],
        "portfolios": [dump_item(item) for item in db.query(Portfolio).all()],
        "inquiries": [dump_item(item) for item in db.query(Inquiry).all()],
        "settings": dump_item(setting) if setting else {},
    }
    return JSONResponse(
        payload,
        headers={"Content-Disposition": "attachment; filename=influence-backup.json"},
    )
