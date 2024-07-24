import { useState, useEffect } from "react";
import styles from "../app/campaigns/campaigns.module.css";
import { CampaignFormProps } from "@/types/campaign";
import { toast } from "react-toastify";
import { CampaignType } from "@/enums/campaign.enums";

const CampaignForm: React.FC<CampaignFormProps> = ({ campaign, onSubmit }) => {
  const [name, setName] = useState(campaign?.name || "");
  const [type, setType] = useState(campaign?.type || CampaignType.CostPerOrder);
  const [startDate, setStartDate] = useState(campaign?.startDate || "");
  const [endDate, setEndDate] = useState(campaign?.endDate || "");
  const [schedule, setSchedule] = useState(
    campaign?.schedule || [{ day: "Monday", startTime: "", endTime: "" }]
  );

  useEffect(() => {
    if (campaign) {
      const start = new Date(campaign.startDate).toISOString().split("T")[0];
      const end = new Date(campaign.endDate).toISOString().split("T")[0];
      setStartDate(start);
      setEndDate(end);
    }
  }, [campaign]);

  const handleScheduleChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSchedule(newSchedule);
  };

  const handleAddSchedule = () => {
    if (getAvailableDays()[0])
      setSchedule([
        ...schedule,
        { day: getAvailableDays()[0], startTime: "", endTime: "" },
      ]);
    else toast.warning("All week days scheduled");
  };

  const handleRemoveSchedule = (index: number) => {
    const newSchedule = schedule.filter((_, i) => i !== index);
    setSchedule(newSchedule);
  };

  const getAvailableDays = (selectedDay?: string) => {
    const allDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const selectedDays = schedule.map((s) => s.day);
    if (selectedDay) {
      selectedDays.splice(selectedDays.indexOf(selectedDay), 1);
    }
    return allDays.filter((day) => !selectedDays.includes(day));
  };

  const validateDates = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDates()) {
      onSubmit({ name, type, startDate, endDate, schedule });
    } else {
      toast.error("Start date can not be less than end date");
    }
  };

  return (
    <div className={styles.main}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.heading}>
          {campaign ? "Edit Campaign" : "Add Campaign"}
        </h2>
        <div className={styles.formGroup}>
          <label htmlFor="name">Campaign Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="type">Campaign Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => {
              const value = e.target.value;
              if (Object.values(CampaignType).includes(value as CampaignType)) {
                setType(value as CampaignType);
              } else {
                toast.error("Invalid CampaignType selected");
              }
            }}
            required
          >
            {Object.values(CampaignType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="startDate">Start Date</label>

          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => {
              validateDates();
              setStartDate(e.target.value);
            }}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => {
              validateDates();
              setEndDate(e.target.value);
            }}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Schedule</label>
          {schedule.map((sched, index) => (
            <div key={index} className={styles.scheduleItem}>
              <select
                value={sched.day}
                onChange={(e) =>
                  handleScheduleChange(index, "day", e.target.value)
                }
                required
              >
                {getAvailableDays(sched.day).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <input
                type="time"
                value={sched.startTime}
                onChange={(e) =>
                  handleScheduleChange(index, "startTime", e.target.value)
                }
                required
              />
              <input
                type="time"
                value={sched.endTime}
                onChange={(e) =>
                  handleScheduleChange(index, "endTime", e.target.value)
                }
                required
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemoveSchedule(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className={styles.addButton}
            onClick={handleAddSchedule}
          >
            Add Schedule
          </button>
        </div>

        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default CampaignForm;
