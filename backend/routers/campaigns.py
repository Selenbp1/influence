from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from models import Campaign
from schemas import CampaignCreate, CampaignOut, CampaignUpdate

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


@router.get("", response_model=list[CampaignOut])
def list_campaigns(db: Session = Depends(get_db)):
    return db.query(Campaign).order_by(Campaign.id.desc()).all()


@router.get("/{item_id}", response_model=CampaignOut)
def get_campaign(item_id: int, db: Session = Depends(get_db)):
    item = db.get(Campaign, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="캠페인을 찾을 수 없습니다.")
    return item


@router.post("", response_model=CampaignOut, dependencies=[Depends(require_admin)])
def create_campaign(payload: CampaignCreate, db: Session = Depends(get_db)):
    item = Campaign(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/{item_id}", response_model=CampaignOut, dependencies=[Depends(require_admin)])
def update_campaign(item_id: int, payload: CampaignUpdate, db: Session = Depends(get_db)):
    item = db.get(Campaign, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="캠페인을 찾을 수 없습니다.")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", dependencies=[Depends(require_admin)])
def delete_campaign(item_id: int, db: Session = Depends(get_db)):
    item = db.get(Campaign, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="캠페인을 찾을 수 없습니다.")
    db.delete(item)
    db.commit()
    return {"ok": True}
