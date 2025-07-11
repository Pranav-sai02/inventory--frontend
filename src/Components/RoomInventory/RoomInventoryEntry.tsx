import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import "./RoomInventoryEntry.css";

import { useHotels } from "../../hooks/useHotels";
import { useSaveInventory } from "../../hooks/useRoomAvailability";
import { SaveInventoryRequest } from "../../type/roomAvailability";

const RoomInventoryEntry: React.FC = () => {
  const navigate = useNavigate();
  const hotelId = 111; // ✅ Static for now
  const { data: hotels } = useHotels();
  const saveInventoryMutation = useSaveInventory();

  const [inventory, setInventory] = useState({
    twinBed: "0",
    beach: "0",
    executive: "0",
  });

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  const selectedHotel = hotels?.find((h) => h.hotelId === hotelId);

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      alert("Please select a valid date range.");
      return;
    }

    const payload: SaveInventoryRequest = {
      hotelId,
      fromDate: startDate.toISOString().split("T")[0], // ✅ renamed
      toDate: endDate.toISOString().split("T")[0],     // ✅ renamed
      rooms: [                                         // ✅ renamed
        { roomId: 1, roomName: "Twin Bed Room", availableCount: parseInt(inventory.twinBed) },
        { roomId: 2, roomName: "Beach Room", availableCount: parseInt(inventory.beach) },
        { roomId: 3, roomName: "Executive Room", availableCount: parseInt(inventory.executive) },
      ],
    };


    saveInventoryMutation.mutate(payload);
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
          placeholder="Select date range"
          onChange={(e) => {
            if (e.target.value === "") setDateRange([null, null]);
          }}
          style={{
            border: "none",
            outline: "none",
            flex: 1,
            fontSize: "14px",
            background: "transparent",
            cursor: "pointer",
          }}
        />
        <span role="img" aria-label="calendar" style={{ fontSize: "18px", marginLeft: "6px" }}>
          🗓️
        </span>
      </div>
    )
  );

  return (
    <div>
      {/* Header Bar */}
      <div className="header-bar">
        <div className="left-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="back-icon">←</span>
          </button>
          <div className="hotel-info">
            <div className="hotel-name">
              Hotel Name: {selectedHotel?.hotelName || "Loading..."}
            </div>
            <div className="hotel-address">
              Address: {selectedHotel?.hotelAddress || "Fetching address..."}
            </div>
          </div>
        </div>
        <div className="hotel-dropdown">
          <select value={hotelId} disabled>
            {hotels?.map((hotel) => (
              <option key={hotel.hotelId} value={hotel.hotelId}>
                {hotel.hotelName} - {hotel.hotelId}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Form Section */}
      <div className="inventory-page">
        <div className="inventory-header">Room Inventory Entry</div>
        <div className="inventory-content">
          {/* Date Picker */}
          <div className="date-picker-container">
            <label>Select Date Range</label>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              customInput={<CustomDateInput />}
              isClearable
            />
          </div>

          {/* Room Inputs */}
          <div className="rooms-inputs">
            {[
              { key: "twinBed", label: "Twin Bed Room" },
              { key: "beach", label: "Beach Room" },
              { key: "executive", label: "Executive Room" },
            ].map(({ key, label }) => (
              <div className="room-input" key={key}>
                <label>{label}</label>
                <input
                  type="number"
                  min="0"
                  value={inventory[key as keyof typeof inventory]}
                  onChange={(e) => {
                    const value = Math.max(0, parseInt(e.target.value) || 0);
                    setInventory({ ...inventory, [key]: value.toString() });
                  }}
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="submit-container">
            <button className="submit-btn" onClick={handleSubmit}>
              Submit Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomInventoryEntry;
