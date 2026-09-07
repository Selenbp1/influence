from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from models import Portfolio
from schemas import PortfolioCreate, PortfolioOut, PortfolioUpdate

router = APIRouter(prefix="/portfolio", tags=["portfolio"])


@router.get("", response_model=list[PortfolioOut])
def list_portfolio(category: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Portfolio).order_by(Portfolio.featured.desc(), Portfolio.id.desc())
    if category and category != "전체":
        query = query.filter(Portfolio.category == category)
    return query.all()


@router.get("/{item_id}", response_model=PortfolioOut)
def get_portfolio(item_id: int, db: Session = Depends(get_db)):
    item = db.get(Portfolio, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="포트폴리오를 찾을 수 없습니다.")
    return item


@router.post("", response_model=PortfolioOut, dependencies=[Depends(require_admin)])
def create_portfolio(payload: PortfolioCreate, db: Session = Depends(get_db)):
    item = Portfolio(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/{item_id}", response_model=PortfolioOut, dependencies=[Depends(require_admin)])
def update_portfolio(item_id: int, payload: PortfolioUpdate, db: Session = Depends(get_db)):
    item = db.get(Portfolio, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="포트폴리오를 찾을 수 없습니다.")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", dependencies=[Depends(require_admin)])
def delete_portfolio(item_id: int, db: Session = Depends(get_db)):
    item = db.get(Portfolio, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="포트폴리오를 찾을 수 없습니다.")
    db.delete(item)
    db.commit()
    return {"ok": True}
