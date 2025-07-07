import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./RoomInventoryEntry.css";

const RoomInventoryEntry: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showNettRate, setShowNettRate] = useState(false);
  const [inventory, setInventory] = useState({
    twinBed: "10",
    beach: "10",
    executive: "5",
  });
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  const days = ["M", "T", "W", "TH", "F", "SA", "S"];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = () => {
    alert("Inventory submitted!");
    console.log("Submitted data:", {
      dateRange,
      selectedDays,
      showNettRate,
      inventory,
    });
  };

  const CustomDateInput = forwardRef<HTMLInputElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
      <div
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "6px 8px",
          width: "300px",
          background: "white",
          cursor: "pointer",
        }}
      >
        <input
          ref={ref}
          value={value}
          readOnly
          placeholder="Select date range"
          style={{
            border: "none",
            outline: "none",
            flex: 1,
            fontSize: "14px",
            background: "transparent",
            cursor: "pointer",
          }}
        />
        <span
          role="img"
          aria-label="calendar"
          style={{ fontSize: "18px", marginLeft: "6px" }}
        >
          📅
        </span>
      </div>
    )
  );

  return (
    <div className="inventory-page">
      <div className="inventory-header">Room Inventory Entry</div>

      <div className="inventory-content">
        <div className="inventory-row">
          <label>Select dates to update inventory for *</label>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            isClearable={true}
            customInput={<CustomDateInput />}
          />
        </div>

        <div className="inventory-row days-row">
          <label>Selected days ({selectedDays.length})</label>
          <div className="days-buttons">
            {days.map((day, index) => (
              <button
                key={index}
                className={`day-btn ${selectedDays.includes(day) ? "selected" : ""}`}
                onClick={() => toggleDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="inventory-row">
          <label>
            <input
              type="checkbox"
              checked={showNettRate}
              onChange={(e) => setShowNettRate(e.target.checked)}
            />
            Show Nett Rate
          </label>
        </div>

        <div className="rooms-inputs">
          <div className="room-input">
            <label>Twin Bed Room</label>
            <input
              type="number"
              value={inventory.twinBed}
              onChange={(e) =>
                setInventory({ ...inventory, twinBed: e.target.value })
              }
            />
          </div>
          <div className="room-input">
            <label>Beach Room</label>
            <input
              type="number"
              value={inventory.beach}
              onChange={(e) =>
                setInventory({ ...inventory, beach: e.target.value })
              }
            />
          </div>
          <div className="room-input">
            <label>Executive Room</label>
            <input
              type="number"
              value={inventory.executive}
              onChange={(e) =>
                setInventory({ ...inventory, executive: e.target.value })
              }
            />
          </div>
        </div>

        <div className="submit-container">
          <button className="submit-btn" onClick={handleSubmit}>
            Submit Inventory
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomInventoryEntry;
