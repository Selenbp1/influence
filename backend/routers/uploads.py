from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile

from auth import require_admin

router = APIRouter(prefix="/uploads", tags=["uploads"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "data" / "uploads"
ALLOWED = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_BYTES = 8 * 1024 * 1024


@router.post("", dependencies=[Depends(require_admin)])
async def upload_image(request: Request, file: UploadFile):
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED:
        raise HTTPException(status_code=400, detail="jpg, png, webp, gif 파일만 올릴 수 있습니다.")
    content = await file.read()
    if len(content) > MAX_BYTES:
        raise HTTPException(status_code=400, detail="이미지는 8MB 이하만 올릴 수 있습니다.")
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    name = f"{uuid4().hex}{suffix}"
    (UPLOAD_DIR / name).write_bytes(content)
    base = str(request.base_url).rstrip("/")
    return {"url": f"{base}/uploads/{name}"}
