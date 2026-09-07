from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from models import SiteSetting
from schemas import SiteSettingOut, SiteSettingUpdate

router = APIRouter(prefix="/settings", tags=["settings"])


def get_or_create_settings(db: Session) -> SiteSetting:
    setting = db.query(SiteSetting).first()
    if not setting:
        setting = SiteSetting()
        db.add(setting)
        db.commit()
        db.refresh(setting)
    return setting


@router.get("", response_model=SiteSettingOut)
def read_settings(db: Session = Depends(get_db)):
    return get_or_create_settings(db)


@router.patch("", response_model=SiteSettingOut, dependencies=[Depends(require_admin)])
def update_settings(payload: SiteSettingUpdate, db: Session = Depends(get_db)):
    setting = get_or_create_settings(db)
    data = payload.model_dump(exclude_unset=True)
    data.pop("admin_password", None)
    for key, value in data.items():
        setattr(setting, key, value)
    db.commit()
    db.refresh(setting)
    return setting
