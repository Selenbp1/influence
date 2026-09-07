from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Influencer(Base):
    __tablename__ = "influencers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    handle: Mapped[str] = mapped_column(String(80), nullable=False)
    category: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    platform: Mapped[str] = mapped_column(String(40), default="Naver")
    followers: Mapped[int] = mapped_column(Integer, default=0)
    bio: Mapped[str] = mapped_column(Text, default="")
    image: Mapped[str] = mapped_column(Text, default="")
    naver_url: Mapped[str] = mapped_column(String(300), default="")
    instagram: Mapped[str] = mapped_column(String(200), default="")
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Campaign(Base):
    __tablename__ = "campaigns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    brand: Mapped[str] = mapped_column(String(120), nullable=False)
    category: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, default="")
    image: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(30), default="진행중")
    result_metric: Mapped[str] = mapped_column(String(200), default="")
    start_date: Mapped[str] = mapped_column(String(20), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Portfolio(Base):
    __tablename__ = "portfolios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    client: Mapped[str] = mapped_column(String(120), nullable=False)
    category: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, default="")
    image: Mapped[str] = mapped_column(Text, default="")
    reach: Mapped[str] = mapped_column(String(80), default="")
    engagement: Mapped[str] = mapped_column(String(80), default="")
    year: Mapped[str] = mapped_column(String(10), default="")
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Inquiry(Base):
    __tablename__ = "inquiries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    company: Mapped[str] = mapped_column(String(120), default="")
    email: Mapped[str] = mapped_column(String(160), nullable=False)
    phone: Mapped[str] = mapped_column(String(40), default="")
    category: Mapped[str] = mapped_column(String(40), default="기타")
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="신규")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class SiteSetting(Base):
    __tablename__ = "settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(160), default="hello@influence.kr")
    phone: Mapped[str] = mapped_column(String(40), default="02-1234-5678")
    address: Mapped[str] = mapped_column(String(200), default="서울특별시 강남구 테헤란로 100")
    instagram: Mapped[str] = mapped_column(String(120), default="influence.official")
    tagline: Mapped[str] = mapped_column(String(200), default="브랜드와 인플루언서를 잇는 네이버 커넥션")
    reply_note: Mapped[str] = mapped_column(Text, default="평일 10:00–19:00 사이 접수된 문의는 영업일 기준 24시간 내 회신합니다.")
    admin_password: Mapped[str] = mapped_column(String(120), default="")
