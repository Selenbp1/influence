from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from models import Inquiry
from schemas import InquiryCreate, InquiryOut, InquiryStatusUpdate

router = APIRouter(prefix="/inquiries", tags=["inquiries"])


@router.post("", response_model=InquiryOut)
def create_inquiry(payload: InquiryCreate, db: Session = Depends(get_db)):
    item = Inquiry(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("", response_model=list[InquiryOut], dependencies=[Depends(require_admin)])
def list_inquiries(db: Session = Depends(get_db)):
    return db.query(Inquiry).order_by(Inquiry.created_at.desc()).all()


@router.patch("/{item_id}", response_model=InquiryOut, dependencies=[Depends(require_admin)])
def update_inquiry(item_id: int, payload: InquiryStatusUpdate, db: Session = Depends(get_db)):
    item = db.get(Inquiry, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="문의를 찾을 수 없습니다.")
    item.status = payload.status
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", dependencies=[Depends(require_admin)])
def delete_inquiry(item_id: int, db: Session = Depends(get_db)):
    item = db.get(Inquiry, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="문의를 찾을 수 없습니다.")
    db.delete(item)
    db.commit()
    return {"ok": True}
