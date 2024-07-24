import { Campaign } from "@/types/campaign";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCampaigns = async () => {
  const response = await axios.get(`${API_URL}/campaigns`);
  return response.data;
};

export const createCampaign = async (campaign: Campaign) => {
  const response = await axios.post(`${API_URL}/campaigns/create`, campaign);
  return response.data;
};

export const updateCampaign = async (id: string, campaign: Campaign) => {
  const response = await axios.patch(
    `${API_URL}/campaigns/update/${id}`,
    campaign
  );
  return response.data;
};

export const getCampaignById = async (id: string) => {
  const response = await axios.get(`${API_URL}/campaigns/${id}`);
  return response.data;
};

export const deleteCampaign = async (id: string) => {
  const response = await axios.delete(`${API_URL}/campaigns/delete/${id}`);
  return response.data;
};
