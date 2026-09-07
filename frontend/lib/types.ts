export type Influencer = {
  id: number;
  name: string;
  handle: string;
  category: string;
  platform: string;
  followers: number;
  bio: string;
  image: string;
  naver_url: string;
  instagram: string;
  featured: boolean;
};

export type Campaign = {
  id: number;
  title: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  status: string;
  result_metric: string;
  start_date: string;
};

export type Portfolio = {
  id: number;
  title: string;
  client: string;
  category: string;
  description: string;
  image: string;
  reach: string;
  engagement: string;
  year: string;
  featured: boolean;
};

export type Inquiry = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  category: string;
  message: string;
  status: string;
  created_at: string;
};

export type Stats = {
  influencers: number;
  campaigns: number;
  portfolios: number;
  inquiries: number;
  new_inquiries: number;
};

export type SiteSetting = {
  email: string;
  phone: string;
  address: string;
  instagram: string;
  tagline: string;
  reply_note: string;
};
