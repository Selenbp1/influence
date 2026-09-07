import axios from "axios";
import { fallbackCampaigns, fallbackInfluencers, fallbackPortfolio, fallbackSettings } from "@/lib/fallback";
import type { Campaign, Influencer, Inquiry, Portfolio, SiteSetting, Stats } from "@/lib/types";

const serverBase = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const clientBase = process.env.NEXT_PUBLIC_API_URL || "";

export const api = axios.create({
  baseURL: clientBase,
  timeout: 30000,
});

export function getToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("influence-admin-token") || "";
}

export function setToken(token: string) {
  sessionStorage.setItem("influence-admin-token", token);
}

export function clearToken() {
  sessionStorage.removeItem("influence-admin-token");
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function fetchPublic<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${serverBase}${path}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export function getInfluencers(category?: string) {
  const query = category && category !== "전체" ? `?category=${encodeURIComponent(category)}` : "";
  return fetchPublic<Influencer[]>(`/api/influencers${query}`, fallbackInfluencers);
}

export function getCampaigns() {
  return fetchPublic<Campaign[]>("/api/campaigns", fallbackCampaigns);
}

export function getPortfolio(category?: string) {
  const query = category && category !== "전체" ? `?category=${encodeURIComponent(category)}` : "";
  return fetchPublic<Portfolio[]>(`/api/portfolio${query}`, fallbackPortfolio);
}

export function getPortfolioItem(id: number) {
  const fallback = fallbackPortfolio.find((item) => item.id === id) ?? null;
  return fetchPublic<Portfolio | null>(`/api/portfolio/${id}`, fallback);
}

export function getSettings() {
  return fetchPublic<SiteSetting>("/api/settings", fallbackSettings);
}
