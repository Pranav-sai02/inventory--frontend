import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RoomList.css";
import ViewRatePlan from "../view-rateplans/ViewRatePlan";
import { useQuery } from "@tanstack/react-query";
import { fetchRoomsByHotel } from "../../../api/rooms";
import { useHotels } from "../../../hooks/useHotels";
import { Hotel } from "../../../type/Hotel";
import { Room } from "../../../type/room";

const RoomList: React.FC = () => {
  const navigate = useNavigate();
  const [hotelId, setHotelId] = useState<number>(0);
  const { data: hotels } = useHotels();

  // Set hotelId to first available once hotels load
  useEffect(() => {
    if (hotels && hotels.length > 0 && hotelId === 0) {
      setHotelId(hotels[0].hotelId);
    }
  }, [hotels]);

  const selectedHotel: Hotel | undefined = hotels?.find((h) => h.hotelId === hotelId);

  const {
    data: roomsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["rooms", hotelId],
    queryFn: () => fetchRoomsByHotel(hotelId),
    enabled: !!hotelId,
  });

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number | null>(null);

  useEffect(() => {
    if (roomsData) {
      const transformed: Room[] = roomsData.map((room: any) => ({
        roomId: room.roomId,
        roomName: room.roomName,
        description: room.description,
        roomType: room.roomType,
        roomView: room.roomView,
        roomSize: room.roomSize,
        sizeUnit: room.sizeUnit,
        numberOfRooms: room.numberOfRooms,
        hotelId: room.hotelId,
        active: true,
      }));
      setRooms(transformed);
    }
  }, [roomsData]);

  const toggleActive = (index: number) => {
    const updated = [...rooms];
    updated[index].active = !updated[index].active;
    setRooms(updated);
  };

  const handleViewRateplans = (index: number) => {
    setSelectedRoomIndex((prev) => (prev === index ? null : index));
  };

  if (isLoading) return <div>Loading rooms...</div>;
  if (isError) return <div>Error loading rooms.</div>;

  return (
    <div>
      {/* Header */}
      <div className="header-bar">
        <div className="left-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="back-icon">←</span>
          </button>
          <div className="hotel-info">
            <div className="hotel-name">Hotel Name: {selectedHotel?.hotelName || "Loading..."}</div>
            <div className="hotel-address">Address: {selectedHotel?.hotelAddress || "N/A"}</div>
          </div>
        </div>
        <div className="hotel-dropdown">
          <select value={hotelId} onChange={(e) => setHotelId(Number(e.target.value))}>
            {hotels?.map((hotel) => (
              <option key={hotel.hotelId} value={hotel.hotelId}>
                {hotel.hotelName} - {hotel.hotelId}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top bar */}
      <div className="top-bar">
        <h2 className="top-bar-title">Existing Rooms ({rooms.length})</h2>
        <button
          className="create-room-btn"
          onClick={() => navigate("/create-room", { state: { hotelId } })}
        >
          + CREATE NEW ROOM
        </button>
      </div>

      {/* Room table */}
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
            <React.Fragment key={room.roomId}>
              <tr className="room-row">
                <td>{room.roomName}</td>
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
                    <button
                      className="action-link"
                      onClick={() => navigate("/create-room", { state: { room } })}
                    >
                      EDIT ROOM
                    </button>
                    <button
                      className="action-link"
                      onClick={() => navigate(`/add-rateplan/${room.roomId}`)}
                    >
                      + ADD RATEPLAN
                    </button>
                  </div>
                </td>
                <td className="rateplans">
                  <button className="action-link" onClick={() => handleViewRateplans(index)}>
                    {selectedRoomIndex === index ? "CLOSE RATEPLANS" : "CLICK TO VIEW RATEPLANS"}
                  </button>
                </td>
              </tr>

              {selectedRoomIndex === index && (
                <tr>
                  <td colSpan={4}>
                    <ViewRatePlan roomId={room.roomId} />
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
