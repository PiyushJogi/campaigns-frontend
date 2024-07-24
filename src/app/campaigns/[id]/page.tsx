"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CampaignForm from "../../../components/CampaignForm";
import { getCampaignById, updateCampaign } from "../../../utils/campaign-api";
import { toast } from "react-toastify";
import { Campaign } from "@/types/campaign";

const EditCampaign = () => {
  const router = useRouter();
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    async function fetchCampaign() {
      try {
        if (id) {
          const data = await getCampaignById(id as string);
          setCampaign(data);
        }
      } catch (err) {
        setCampaign(null);
        toast.error(
          `${
            err.response.data.message[0] ||
            err.message ||
            "Error in fetching campaign details"
          }`
        );
      }
    }
    fetchCampaign();
  }, [id]);

  const handleUpdateCampaign = async (updatedCampaign: Campaign) => {
    try {
      await updateCampaign(id as string, updatedCampaign);
      router.push("/campaigns");
    } catch (err) {
      toast.error(
        `${
          err.response.data.message[0] ||
          err.message ||
          "Error in updating campaign"
        }`
      );
    }
  };

  return (
    <div>
      {campaign && (
        <CampaignForm campaign={campaign} onSubmit={handleUpdateCampaign} />
      )}
    </div>
  );
};

export default EditCampaign;
