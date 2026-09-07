from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from models import Influencer
from schemas import InfluencerCreate, InfluencerOut, InfluencerUpdate

router = APIRouter(prefix="/influencers", tags=["influencers"])


@router.get("", response_model=list[InfluencerOut])
def list_influencers(category: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Influencer).order_by(Influencer.featured.desc(), Influencer.followers.desc())
    if category and category != "전체":
        query = query.filter(Influencer.category == category)
    return query.all()


@router.get("/{item_id}", response_model=InfluencerOut)
def get_influencer(item_id: int, db: Session = Depends(get_db)):
    item = db.get(Influencer, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="인플루언서를 찾을 수 없습니다.")
    return item


@router.post("", response_model=InfluencerOut, dependencies=[Depends(require_admin)])
def create_influencer(payload: InfluencerCreate, db: Session = Depends(get_db)):
    item = Influencer(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/{item_id}", response_model=InfluencerOut, dependencies=[Depends(require_admin)])
def update_influencer(item_id: int, payload: InfluencerUpdate, db: Session = Depends(get_db)):
    item = db.get(Influencer, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="인플루언서를 찾을 수 없습니다.")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", dependencies=[Depends(require_admin)])
def delete_influencer(item_id: int, db: Session = Depends(get_db)):
    item = db.get(Influencer, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="인플루언서를 찾을 수 없습니다.")
    db.delete(item)
    db.commit()
    return {"ok": True}
