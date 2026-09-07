import { api } from "@/lib/api";
import type { Campaign, Influencer, Inquiry, Portfolio, SiteSetting, Stats } from "@/lib/types";

export async function adminLogin(password: string) {
  const { data } = await api.post<{ token: string }>("/api/auth/login", { password });
  return data.token;
}

export async function getStats() {
  const { data } = await api.get<Stats>("/api/stats");
  return data;
}

export async function listInfluencers() {
  const { data } = await api.get<Influencer[]>("/api/influencers");
  return data;
}

export async function saveInfluencer(payload: Partial<Influencer>, id?: number) {
  if (id) {
    const { data } = await api.patch<Influencer>(`/api/influencers/${id}`, payload);
    return data;
  }
  const { data } = await api.post<Influencer>("/api/influencers", payload);
  return data;
}

export async function deleteInfluencer(id: number) {
  await api.delete(`/api/influencers/${id}`);
}

export async function listCampaigns() {
  const { data } = await api.get<Campaign[]>("/api/campaigns");
  return data;
}

export async function saveCampaign(payload: Partial<Campaign>, id?: number) {
  if (id) {
    const { data } = await api.patch<Campaign>(`/api/campaigns/${id}`, payload);
    return data;
  }
  const { data } = await api.post<Campaign>("/api/campaigns", payload);
  return data;
}

export async function deleteCampaign(id: number) {
  await api.delete(`/api/campaigns/${id}`);
}

export async function listPortfolio() {
  const { data } = await api.get<Portfolio[]>("/api/portfolio");
  return data;
}

export async function savePortfolio(payload: Partial<Portfolio>, id?: number) {
  if (id) {
    const { data } = await api.patch<Portfolio>(`/api/portfolio/${id}`, payload);
    return data;
  }
  const { data } = await api.post<Portfolio>("/api/portfolio", payload);
  return data;
}

export async function deletePortfolio(id: number) {
  await api.delete(`/api/portfolio/${id}`);
}

export async function listInquiries() {
  const { data } = await api.get<Inquiry[]>("/api/inquiries");
  return data;
}

export async function updateInquiryStatus(id: number, status: string) {
  const { data } = await api.patch<Inquiry>(`/api/inquiries/${id}`, { status });
  return data;
}

export async function deleteInquiry(id: number) {
  await api.delete(`/api/inquiries/${id}`);
}

export async function createInquiry(payload: {
  name: string;
  company: string;
  email: string;
  phone: string;
  category: string;
  message: string;
}) {
  const { data } = await api.post<Inquiry>("/api/inquiries", payload);
  return data;
}

export async function getAdminSettings() {
  const { data } = await api.get<SiteSetting>("/api/settings");
  return data;
}

export async function saveSettings(payload: Partial<SiteSetting>) {
  const { data } = await api.patch<SiteSetting>("/api/settings", payload);
  return data;
}

export async function changePassword(current_password: string, new_password: string) {
  await api.post("/api/auth/password", { current_password, new_password });
}

export async function downloadBackup() {
  const { data } = await api.get("/api/backup", { responseType: "blob" });
  const url = URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = url;
  link.download = "influence-backup.json";
  link.click();
  URL.revokeObjectURL(url);
}
