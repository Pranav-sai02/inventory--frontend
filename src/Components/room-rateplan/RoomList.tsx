import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RoomList.css";
import ViewRatePlan, { RatePlan } from "../room-rateplan/ViewRatePlan";

interface Room {
  name: string;
  description: string;
  active: boolean;
  rateplans: string[];
}

const initialRooms: Room[] = [
  { name: "Twin Bed Room", description: "clean and neat", active: true, rateplans: ["EP", "MP", "CP"] },
  { name: "Beach Room", description: "Beach Room", active: true, rateplans: ["MP", "CP"] },
  { name: "Executive Room", description: "comfortable stay and free room service", active: true, rateplans: ["EP", "CP"] },
];

const RoomList: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number | null>(null);
  const [selectedRateplans, setSelectedRateplans] = useState<RatePlan[] | null>(null);

  const toggleActive = (index: number) => {
    const updatedRooms = [...rooms];
    updatedRooms[index].active = !updatedRooms[index].active;
    setRooms(updatedRooms);
  };

  const handleViewRateplans = (room: Room, index: number) => {
    if (selectedRoomIndex === index) {
      setSelectedRoomIndex(null);
      setSelectedRateplans(null);
    } else {
      const mockRateplans: RatePlan[] = room.rateplans.map((rp) => ({
        name: rp,
        mealPlan: rp === "EP" ? "FREE Breakfast" : "FREE All Meals",
        paymentMode: "Pay Now",
        active: true,
      }));
      setSelectedRateplans(mockRateplans);
      setSelectedRoomIndex(index);
    }
  };

  const handleRateplanCheckboxChange = (index: number) => {
    if (!selectedRateplans) return;
    const updated = [...selectedRateplans];
    updated[index].active = !updated[index].active;
    setSelectedRateplans(updated);
  };

  return (
    <div>
      {/* Header bar */}
      <div className="header-bar">
        <div className="left-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="back-icon">←</span>
          </button>
          <div className="hotel-info">
            <div className="hotel-name">Hotel Name: Hotel Vista</div>
            <div className="hotel-address">
              Address: 3-12 Ayodhya nagara jntu Hyderabad Telangana
            </div>
          </div>
        </div>
        <div className="hotel-dropdown">
          <select>
            <option>Hotel Vista - 41365364</option>
            <option>Hotel Paradise - 12345678</option>
          </select>
        </div>
      </div>

      {/* Existing Rooms heading + create button */}
      <div className="top-bar">
        <h2 className="top-bar-title">Existing Rooms ({rooms.length})</h2>
        <button className="create-room-btn" onClick={() => navigate("/create-room")}>
          + CREATE NEW ROOM
        </button>
      </div>

      {/* Room list table */}
      <table className="table">
        <thead>
          <tr>
            <th>Room Name</th>
            <th>Description</th>
            <th>Actions</th>
            <th>Rateplans</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => (
            <React.Fragment key={index}>
              <tr className="room-row">
                <td>{room.name}</td>
                <td>{room.description}</td>
                <td>
                  <div className="actions">
                    <label>
                      <input
                        type="checkbox"
                        checked={room.active}
                        onChange={() => toggleActive(index)}
                      />
                      Active
                    </label>
                    <button className="action-link" onClick={() => navigate("/edit-room")}>
                      EDIT ROOM
                    </button>
                    <button className="action-link" onClick={() => navigate("/add-rateplan")}>
                      + ADD RATEPLAN
                    </button>
                  </div>
                </td>
                <td className="rateplans">
                  <ol>
                    {room.rateplans.map((rp, idx) => (
                      <li key={idx}>{rp}</li>
                    ))}
                  </ol>
                  <button className="action-link" onClick={() => handleViewRateplans(room, index)}>
                    {selectedRoomIndex === index ? "CLOSE RATEPLANS" : "CLICK TO VIEW RATEPLANS"}
                  </button>
                </td>
              </tr>

              {selectedRoomIndex === index && selectedRateplans && (
                <tr>
                  <td colSpan={4}>
                    <ViewRatePlan
                      rateplans={selectedRateplans}
                      onCheckboxChange={handleRateplanCheckboxChange}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomList;
