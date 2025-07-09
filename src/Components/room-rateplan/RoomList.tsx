import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RoomList.css";
import ViewRatePlan from "../room-rateplan/ViewRatePlan";
import { useQuery } from "@tanstack/react-query";
import { fetchRoomsByHotel } from "../../api/rooms";

interface Room {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

const RoomList: React.FC = () => {
  const navigate = useNavigate();
  const hotelId = 111;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["rooms", hotelId],
    queryFn: () => fetchRoomsByHotel(hotelId),
  });

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number | null>(null);

  useEffect(() => {
    if (data) {
      const transformedRooms: Room[] = data.map((room: any) => ({
        id: room.roomId,
        name: room.roomName,
        description: room.description,
        active: true, // Default since API doesn’t return this
      }));
      setRooms(transformedRooms);
    }
  }, [data]);

  const toggleActive = (index: number) => {
    const updated = [...rooms];
    updated[index].active = !updated[index].active;
    setRooms(updated);
  };

  const handleViewRateplans = (index: number) => {
    if (selectedRoomIndex === index) {
      setSelectedRoomIndex(null);
    } else {
      setSelectedRoomIndex(index);
    }
  };

  if (isLoading) return <div>Loading rooms...</div>;
  if (isError) return <div>Error loading rooms.</div>;

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
            <React.Fragment key={room.id}>
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
                    <button
                      className="action-link"
                      onClick={() =>
                        navigate("/add-rateplan", { state: { roomId: room.id } })
                      }
                    >
                      + ADD RATEPLAN
                    </button>
                  </div>
                </td>
                <td className="rateplans">
                  <button
                    className="action-link"
                    onClick={() => handleViewRateplans(index)}
                  >
                    {selectedRoomIndex === index
                      ? "CLOSE RATEPLANS"
                      : "CLICK TO VIEW RATEPLANS"}
                  </button>
                </td>
              </tr>

              {selectedRoomIndex === index && (
                <tr>
                  <td colSpan={4}>
                    <ViewRatePlan roomId={room.id} />
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
