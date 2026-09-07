from datetime import datetime

from pydantic import BaseModel, Field


class InfluencerBase(BaseModel):
    name: str
    handle: str
    category: str
    platform: str = "Naver"
    followers: int = 0
    bio: str = ""
    image: str = ""
    naver_url: str = ""
    instagram: str = ""
    featured: bool = False


class InfluencerCreate(InfluencerBase):
    pass


class InfluencerUpdate(BaseModel):
    name: str | None = None
    handle: str | None = None
    category: str | None = None
    platform: str | None = None
    followers: int | None = None
    bio: str | None = None
    image: str | None = None
    naver_url: str | None = None
    instagram: str | None = None
    featured: bool | None = None


class InfluencerOut(InfluencerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class CampaignBase(BaseModel):
    title: str
    brand: str
    category: str
    description: str = ""
    image: str = ""
    status: str = "진행중"
    result_metric: str = ""
    start_date: str = ""


class CampaignCreate(CampaignBase):
    pass


class CampaignUpdate(BaseModel):
    title: str | None = None
    brand: str | None = None
    category: str | None = None
    description: str | None = None
    image: str | None = None
    status: str | None = None
    result_metric: str | None = None
    start_date: str | None = None


class CampaignOut(CampaignBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class PortfolioBase(BaseModel):
    title: str
    client: str
    category: str
    description: str = ""
    image: str = ""
    reach: str = ""
    engagement: str = ""
    year: str = ""
    featured: bool = False


class PortfolioCreate(PortfolioBase):
    pass


class PortfolioUpdate(BaseModel):
    title: str | None = None
    client: str | None = None
    category: str | None = None
    description: str | None = None
    image: str | None = None
    reach: str | None = None
    engagement: str | None = None
    year: str | None = None
    featured: bool | None = None


class PortfolioOut(PortfolioBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class InquiryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    company: str = ""
    email: str = Field(min_length=3, max_length=160)
    phone: str = ""
    category: str = "기타"
    message: str = Field(min_length=5)


class InquiryStatusUpdate(BaseModel):
    status: str


class InquiryOut(InquiryCreate):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    password: str


class TokenOut(BaseModel):
    token: str


class StatsOut(BaseModel):
    influencers: int
    campaigns: int
    portfolios: int
    inquiries: int
    new_inquiries: int


class SiteSettingOut(BaseModel):
    email: str
    phone: str
    address: str
    instagram: str
    tagline: str
    reply_note: str

    class Config:
        from_attributes = True


class SiteSettingUpdate(BaseModel):
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    instagram: str | None = None
    tagline: str | None = None
    reply_note: str | None = None
    admin_password: str | None = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=4)

