# INFLUENCE

네이버 인플루언서 마케팅 에이전시 홈페이지입니다. 여행, 리빙, 경제를 중심으로 브랜드와 인플루언서를 연결합니다.

비개발자 관리자는 코드 없이 `/admin`에서 인플루언서, 캠페인, 포트폴리오, 문의, 연락처를 수정합니다.

## 구성

- `frontend`: Next.js + TypeScript + Tailwind CSS + shadcn/ui
- `backend`: FastAPI + SQLite + SQLAlchemy

Next.js App Router를 사용하므로 React Router와 Vite는 넣지 않았습니다.

로컬은 SQLite입니다. Vercel에서 관리자가 저장한 내용이 유지되려면 무료 DB(Neon 등)의 `DATABASE_URL`을 한 번 연결하면 됩니다. 이 작업은 개발자가 하고, 이후 운영은 관리자 화면만 사용합니다.

## 로컬 실행

터미널 1 (API)

```bash
cd backend
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

터미널 2 (웹)

```bash
cd frontend
npm install
npm run dev
```

- 사이트: http://localhost:3000
- 관리자: http://localhost:3000/admin
- 처음 비밀번호: `admin123` (관리자 화면에서 바꿀 수 있습니다)

8000번 포트가 이미 사용 중이면 `--port 4700`처럼 바꾸고, `frontend/.env.local`의 `API_URL`과 `NEXT_PUBLIC_API_URL`도 같은 주소로 맞춥니다.

## 관리자 사용

1. `/admin` 로그인
2. 들어온 문의 확인
3. 인플루언서 / 캠페인 / 포트폴리오에 사진 올리고 저장
4. 사이트 정보에서 전화, 이메일, 주소 수정
5. 가끔 백업 파일을 받아 두기

## GitHub + Vercel + Neon

역할이 나뉩니다.

- **GitHub**: 코드만 보관합니다. `main`에 푸시하면 Vercel이 사이트를 다시 배포합니다.
- **Vercel**: 홈페이지와 API를 실행합니다.
- **Neon**: 문의, 인플루언서, 포트폴리오 같은 **데이터**를 보관합니다. GitHub에 올라가지 않습니다.

친구는 홈페이지 하단 **관리자**로 들어가 글과 사진을 수정하면 됩니다. GitHub을 만질 필요는 없습니다.

관리자 주소: `/admin` (예: https://influence-ruby.vercel.app/admin)

### Neon 연결 (한 번만)

지금처럼 프론트만 Vercel에 올린 경우에는 **그 프로젝트**에 `DATABASE_URL`을 넣으면 됩니다.

1. https://console.neon.tech 에서 `influence` 프로젝트 열기
2. **Connect** → Pooled connection 문자열 복사
3. Vercel `influence-ruby` (또는 프론트 프로젝트) → Settings → Environment Variables
   - `DATABASE_URL` = 복사한 문자열
   - `ADMIN_PASSWORD` = 관리자 비밀번호
4. Redeploy

`NEXT_PUBLIC_API_URL` 은 비워 두세요. 같은 사이트 주소의 `/api` 를 사용합니다.

