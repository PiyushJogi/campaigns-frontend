import { CampaignType } from "@/enums/campaign.enums";

export interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Campaign {
  _id?: string;
  name: string;
  type: CampaignType;
  startDate: string;
  endDate: string;
  schedule: Schedule[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CampaignFormProps {
  campaign?: Campaign & { id?: string };
  onSubmit: (campaign: Campaign) => void;
}

export interface CampaignListProps {
  campaigns: Campaign[];
  onDelete: (id: string) => void;
}
