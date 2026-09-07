from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import ADMIN_PASSWORD, create_token, require_admin
from database import get_db
from models import SiteSetting
from schemas import LoginRequest, PasswordChange, SiteSettingOut, SiteSettingUpdate, TokenOut

router = APIRouter(prefix="/auth", tags=["auth"])


def current_password(db: Session) -> str:
    setting = db.query(SiteSetting).first()
    if setting and setting.admin_password:
        return setting.admin_password
    return ADMIN_PASSWORD


@router.post("/login", response_model=TokenOut)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    if payload.password != current_password(db):
        raise HTTPException(status_code=401, detail="비밀번호가 올바르지 않습니다.")
    return TokenOut(token=create_token())


@router.post("/password", dependencies=[Depends(require_admin)])
def change_password(payload: PasswordChange, db: Session = Depends(get_db)):
    if payload.current_password != current_password(db):
        raise HTTPException(status_code=400, detail="현재 비밀번호가 올바르지 않습니다.")
    setting = db.query(SiteSetting).first()
    if not setting:
        setting = SiteSetting()
        db.add(setting)
    setting.admin_password = payload.new_password
    db.commit()
    return {"ok": True, "message": "비밀번호가 변경되었습니다."}
