import os
from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

SECRET_KEY = os.getenv("ADMIN_SECRET", "influence-admin-secret-change-me")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 12

bearer = HTTPBearer(auto_error=False)


def create_token() -> str:
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    return jwt.encode({"sub": "admin", "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def verify_password(password: str) -> bool:
    return password == ADMIN_PASSWORD


def require_admin(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)):
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="로그인이 필요합니다.")
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("sub") != "admin":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="권한이 없습니다.")
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="유효하지 않은 토큰입니다.") from exc
    return True
