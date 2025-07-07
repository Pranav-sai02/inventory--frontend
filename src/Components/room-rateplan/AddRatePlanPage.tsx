import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddRatePlanPage.css";

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

  const [rateplanName, setRateplanName] = useState("EP");
  const [mealPlan, setMealPlan] = useState("Accommodation only");

  const handleSave = () => {
    alert(`Saved Rateplan:\nName: ${rateplanName}\nMeal Plan: ${mealPlan}`);
    navigate(-1);
  };

  return (
    <div className="add-rateplan-page">
      <div className="add-rateplan-container">
        <div className="form-group">
          <label htmlFor="rateplan">Rateplan Name *</label>
          <select
            id="rateplan"
            value={rateplanName}
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
          <button onClick={handleSave} className="save-btn">
            SAVE AND CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRatePlanPage;
