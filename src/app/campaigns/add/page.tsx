"use client"
import { useRouter } from "next/navigation";
import CampaignForm from "../../../components/CampaignForm"
import { createCampaign } from "../../../utils/campaign-api";
import { toast } from "react-toastify";
import { Campaign } from "@/types/campaign";

const AddCampaign = () => {
  const router = useRouter();

  const handleCreateCampaign = async (campaign: Campaign) => {
    try{
      await createCampaign(campaign);
      router.push("/campaigns");
    } catch(err){
      toast.error(`${err.response.data.message[0] || err.message || 'Error in creating campaign'}`);
    }
  };

  return (
    <div>
      <CampaignForm onSubmit={handleCreateCampaign} />
    </div>
  );
};

export default AddCampaign;
