"use client";
import { useEffect, useState } from "react";
import { getCampaigns } from "../../utils/campaign-api";
import CampaignList from "../../components/CampaignList";
import styles from "./campaigns.module.css";
import Link from "next/link";
import { toast } from "react-toastify";
import { Campaign } from "@/types/campaign";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[] | []>([]);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const data = await getCampaigns();
        setCampaigns(data);
      } catch (err) {
        setCampaigns([]);
        toast.error(
          `${
            err.response.data.message[0] ||
            err.message ||
            "Error in fetching campaign"
          }`
        );
      }
    }
    fetchCampaigns();
  }, []);

  const handleDelete = (id: string) => {
    setCampaigns(campaigns.filter((campaign) => campaign._id !== id));
  };

  return (
    <main className={styles.main}>
      <div className={styles.campaignList}>
        <div className={styles.row}>
          <h2 className={styles.heading}>Campaigns</h2>
          <Link className={styles.button} href={`/campaigns/add`}>
            Add Campaign
          </Link>
        </div>
        <CampaignList campaigns={campaigns} onDelete={handleDelete} />
      </div>
    </main>
  );
};

export default Campaigns;
