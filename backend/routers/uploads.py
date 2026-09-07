import base64
import os
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile

from auth import require_admin
from database import IS_POSTGRES

router = APIRouter(prefix="/uploads", tags=["uploads"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "data" / "uploads"
ALLOWED = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MIME = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
}
MAX_BYTES = 8 * 1024 * 1024
MAX_PERSISTED = 2 * 1024 * 1024


@router.post("", dependencies=[Depends(require_admin)])
async def upload_image(request: Request, file: UploadFile):
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED:
        raise HTTPException(status_code=400, detail="jpg, png, webp, gif 파일만 올릴 수 있습니다.")
    content = await file.read()
    if len(content) > MAX_BYTES:
        raise HTTPException(status_code=400, detail="이미지는 8MB 이하만 올릴 수 있습니다.")

    persist_in_db = IS_POSTGRES or bool(os.getenv("VERCEL"))
    if persist_in_db:
        if len(content) > MAX_PERSISTED:
            raise HTTPException(status_code=400, detail="배포 환경에서는 이미지는 2MB 이하로 올려주세요.")
        mime = MIME.get(suffix, file.content_type or "image/jpeg")
        encoded = base64.b64encode(content).decode("ascii")
        return {"url": f"data:{mime};base64,{encoded}"}

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    name = f"{uuid4().hex}{suffix}"
    (UPLOAD_DIR / name).write_bytes(content)
    base = str(request.base_url).rstrip("/")
    return {"url": f"{base}/uploads/{name}"}
