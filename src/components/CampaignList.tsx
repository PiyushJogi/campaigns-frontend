import Link from "next/link";
import styles from "../app/campaigns/campaigns.module.css";
import { deleteCampaign } from "@/utils/campaign-api";
import {  CampaignListProps, Schedule } from "@/types/campaign";
import { toast } from "react-toastify";

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  margin: "20px 0",
};

const thStyle: React.CSSProperties = {
  backgroundColor: "#f4f4f4",
  color: "#333",
  padding: "12px 15px",
  textAlign: "left",
  borderBottom: "2px solid #ddd",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 15px",
  borderBottom: "1px solid #ddd",
};

const findNextSchedule = (schedule: Schedule[], endDate: string): string => {
  const now = new Date();
  const end = new Date(endDate);

  // Find the next schedule within the campaign's duration
  const nextSchedule = schedule
    .map(({ day, startTime, endTime }) => {
      const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);
      const daysUntilNext = (dayIndex - now.getDay() + 7) % 7;
      const nextDate = new Date(now);
      nextDate.setDate(now.getDate() + daysUntilNext);
      nextDate.setHours(parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1]));
      
      if (nextDate > end) return null;  // Skip if next date is after the campaign end date

      return {
        date: nextDate,
        endTime: new Date(nextDate).setHours(parseInt(endTime.split(':')[0]), parseInt(endTime.split(':')[1]))
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => a.date - b.date)[0];

  return nextSchedule ? `${formatDate(nextSchedule.date.toDateString())} - ${nextSchedule.date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}` : 'No upcoming schedule';
};


const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const CampaignList: React.FC<CampaignListProps> = ({ campaigns, onDelete }) => {
  const handleDelete = async (id: string) => {
    try{
      if (confirm("Are you sure you want to delete this campaign?")) {
        await deleteCampaign(id);
        onDelete(id);
      }
    } catch(err){
      toast.error(`${err.response.data.message[0] || err.message || 'Error in deleting campaign'}`);
    }  
  };
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Type</th>
          <th style={thStyle}>Start Date</th>
          <th style={thStyle}>End Date</th>
          <th style={thStyle}>Next Scheduled Activation</th>
          <th style={thStyle}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {campaigns.length<1 && (<p className={styles.textInfo}>No campaigns created</p>)}
        {campaigns.map((campaign) => (
          <tr key={campaign._id}>
            <td style={tdStyle}>{campaign.name}</td>
            <td style={tdStyle}>{campaign.type}</td>
            <td style={tdStyle}>{formatDate(campaign.startDate)}</td>
            <td style={tdStyle}>{formatDate(campaign.endDate)}</td>
            <td style={tdStyle}>{findNextSchedule(campaign.schedule,campaign.endDate)}</td>
            <td style={tdStyle}>
              <Link
                className={`${styles.button} ${styles.small} ${styles.edit}`}
                href={`/campaigns/${campaign._id}`}
              >
                Edit
              </Link>
              <Link
                href="#"
                className={`${styles.button} ${styles.small} ${styles.delete}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(campaign._id || "");
                }}
              >
                Delete
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CampaignList;
