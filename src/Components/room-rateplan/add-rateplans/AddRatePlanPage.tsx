import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddRatePlanPage.css";

import { RatePlan } from "../../../type/RatePlan";
import { useCreateRatePlan } from "../../../hooks/useRatePlan";

const rateplanOptions = ["AP", "EP", "CP", "MAP"];
const mealPlanOptions = [
  "Accommodation only",
  "FREE Breakfast",
  "FREE Breakfast and Lunch/Dinner",
  "FREE Breakfast, Lunch and Dinner",
  "FREE Cooked Breakfast",
  "FREE Breakfast, Lunch, Dinner and Custom Inclusions",
  "FREE Breakfast and Lunch",
  "FREE Breakfast and Dinner",
  "FREE Lunch",
  "FREE Dinner",
];

const AddRatePlanPage: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams(); // 👈 get from URL
  const numericRoomId = parseInt(roomId || "", 10);

  const [ratePlanName, setRateplanName] = useState("EP");
  const [mealPlan, setMealPlan] = useState("Accommodation only");

  const createRatePlanMutation = useCreateRatePlan();

  const handleSave = () => {
    if (!numericRoomId || isNaN(numericRoomId)) {
      alert("Room ID is missing or invalid!");
      return;
    }

    const newRatePlan: Omit<RatePlan, "ratePlanId"> = {
      ratePlanName,
      mealPlan,
      roomId: numericRoomId,
    };

    createRatePlanMutation.mutate(newRatePlan, {
      onSuccess: () => {
        alert("✅ Rate plan created successfully!");
        navigate(-1);
      },
      onError: () => {
        alert("❌ Failed to create rate plan.");
      },
    });
  };

  return (
    <div className="add-rateplan-page">
      <div className="add-rateplan-container">
        <div className="form-group">
          <label htmlFor="rateplan">Rateplan Name *</label>
          <select
            id="rateplan"
            value={ratePlanName}
            onChange={(e) => setRateplanName(e.target.value)}
            className="form-select"
          >
            {rateplanOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="mealplan">Meal Plan *</label>
          <select
            id="mealplan"
            value={mealPlan}
            onChange={(e) => setMealPlan(e.target.value)}
            className="form-select"
          >
            {mealPlanOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="button-group-right">
          <button
            onClick={handleSave}
            className="save-btn"
            disabled={createRatePlanMutation.isPending}
          >
            {createRatePlanMutation.isPending ? "Saving..." : "SAVE AND CONTINUE"}
          </button>
          <button onClick={() => navigate(-1)} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRatePlanPage;
