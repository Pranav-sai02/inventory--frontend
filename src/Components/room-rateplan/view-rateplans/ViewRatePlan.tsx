import React from "react";
import "./ViewRatePlan.css";
import { useRatePlansByRoom } from "../../../hooks/useRatePlan";

interface ViewRatePlanProps {
  roomId: number;
  onCheckboxChange?: (index: number) => void;
}

const ViewRatePlan: React.FC<ViewRatePlanProps> = ({ roomId, onCheckboxChange }) => {
  const { data: rateplans, isLoading, isError } = useRatePlansByRoom(roomId);

  if (isLoading) return <p>Loading rate plans...</p>;
  if (isError) return <p>Failed to load rate plans.</p>;
  if (!rateplans || rateplans.length === 0) return <p>No rate plans found for this room.</p>;

  return (
    <div className="view-rateplan-container">
      <h3>Rate Plans Details:</h3>
      <table className="view-rateplan-table">
        <thead>
          <tr>
            <th>Rateplan Name</th>
            <th>Meal Plan</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rateplans.map((rp, idx) => (
            <tr key={rp.ratePlanId ?? idx}>
              <td>{rp.ratePlanName}</td> {/* ✅ based on your model */}
              <td>{rp.mealPlan}</td>
              <td className="actions">
                <label>
                  <input
                    type="checkbox"
                    checked={true} // ✅ hardcoded for now
                    onChange={() => onCheckboxChange?.(idx)}
                    style={{ marginRight: "5px" }}
                  />
                  Active
                </label>
                <div className="action-buttons">
                  <div className="action-line">
                    <button
                      className="action-link"
                      onClick={() => alert("Editing rateplan...")}
                    >
                      EDIT
                    </button>
                  </div>
                  <div className="action-line">
                    <button
                      className="action-link"
                      onClick={() => alert("Offering inclusion...")}
                    >
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
