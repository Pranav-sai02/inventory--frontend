import React from "react";
import "./ViewRatePlan.css";

export interface RatePlan {
  name: string;
  mealPlan: string;
  paymentMode: string;
  active: boolean;
}

interface ViewRatePlanProps {
  rateplans: RatePlan[];
  onCheckboxChange: (index: number) => void;
}

const ViewRatePlan: React.FC<ViewRatePlanProps> = ({ rateplans, onCheckboxChange }) => {
  return (
    <div className="view-rateplan-container">
      <h3>Rate Plans Details:</h3>
      <table className="view-rateplan-table">
        <thead>
          <tr>
            <th>Rateplan Name</th>
            <th>Meal Plan</th>
            <th>Payment Mode</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rateplans.map((rp, idx) => (
            <tr key={idx}>
              <td>{rp.name}</td>
              <td>{rp.mealPlan}</td>
              <td>{rp.paymentMode}</td>
              <td className="actions">
                <label>
                  <input
                    type="checkbox"
                    checked={rp.active}
                    onChange={() => onCheckboxChange(idx)}
                    style={{ marginRight: "5px" }}
                  />
                  Active
                </label>
                <div className="action-buttons">
                  <div className="action-line">
                    <button className="action-link" onClick={() => alert("Editing rateplan...")}>
                      EDIT
                    </button>
                  </div>
                  <div className="action-line">
                    <button className="action-link" onClick={() => alert("Offering inclusion...")}>
                      + OFFER AN INCLUSION
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewRatePlan;
