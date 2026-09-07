from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from models import Campaign, Influencer, Inquiry, Portfolio
from schemas import StatsOut

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("", response_model=StatsOut, dependencies=[Depends(require_admin)])
def get_stats(db: Session = Depends(get_db)):
    return StatsOut(
        influencers=db.query(Influencer).count(),
        campaigns=db.query(Campaign).count(),
        portfolios=db.query(Portfolio).count(),
        inquiries=db.query(Inquiry).count(),
        new_inquiries=db.query(Inquiry).filter(Inquiry.status == "신규").count(),
    )
