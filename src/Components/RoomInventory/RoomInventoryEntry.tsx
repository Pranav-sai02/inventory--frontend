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
  const { data: hotels } = useHotels(); // ✅ already includes rooms + ratePlans
  const saveInventoryMutation = useSaveInventory();

  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
  const [inventory, setInventory] = useState<{ [roomId: string]: string }>({});
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  const selectedHotel = hotels?.find((h) => h.hotelId === selectedHotelId);
  const rooms = selectedHotel?.rooms || [];

  const handleSubmit = () => {
    if (!startDate || !endDate || !selectedHotelId) {
      alert("Please select a valid hotel and date range.");
      return;
    }

    const payload: SaveInventoryRequest = {
      hotelId: selectedHotelId,
      fromDate: startDate.toISOString().split("T")[0],
      toDate: endDate.toISOString().split("T")[0],
      rooms: rooms.map((room) => ({
        roomId: room.roomId,
        roomName: room.roomName,
        availableCount: parseInt(inventory[room.roomId.toString()] || "0"),
      })),
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
      {/* Header */}
      <div className="header-bar">
        <div className="left-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="back-icon">←</span>
          </button>
          <div className="hotel-info">
            <div className="hotel-name">
              Hotel Name: {selectedHotel?.hotelName || "Select a hotel"}
            </div>
            <div className="hotel-address">
              Address: {selectedHotel?.hotelAddress || "Hotel address will appear here"}
            </div>
          </div>
        </div>

        <div className="hotel-dropdown">
          <select
            value={selectedHotelId ?? ""}
            onChange={(e) => {
              setSelectedHotelId(parseInt(e.target.value));
              setInventory({}); // reset inventory on hotel change
            }}
          >
            <option value="" disabled>
              -- Select Hotel --
            </option>
            {hotels?.map((hotel) => (
              <option key={hotel.hotelId} value={hotel.hotelId}>
                {hotel.hotelName} - {hotel.hotelId}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Form */}
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

          {/* Room Inputs (from hotel.rooms) */}
          <div className="rooms-inputs">
            {rooms.map((room) => (
              <div className="room-input" key={room.roomId}>
                <label>{room.roomName}</label>
                <input
                  type="number"
                  min="0"
                  value={inventory[room.roomId.toString()] || "0"}
                  onChange={(e) => {
                    const value = Math.max(0, parseInt(e.target.value) || 0);
                    setInventory((prev) => ({
                      ...prev,
                      [room.roomId.toString()]: value.toString(),
                    }));
                  }}
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="submit-container">
            <button className="submit-btn" onClick={handleSubmit} disabled={!selectedHotelId}>
              Submit Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomInventoryEntry;
