import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./CreateRoom.css";
import { useCreateRoom, useUpdateRoom } from "../../hooks/useRooms";
import { Room } from "../../type/room";

const CreateRoom: React.FC = () => {
  const location = useLocation();
  const editingRoom = location.state?.room as Room | undefined;

  const hotelId = 111; // static for now
  const createRoomMutation = useCreateRoom(hotelId);
  const updateRoomMutation = useUpdateRoom(hotelId);

  const [roomType, setRoomType] = useState(editingRoom?.roomType || "");
  const [roomView, setRoomView] = useState(editingRoom?.roomView || "");
  const [roomSize, setRoomSize] = useState(editingRoom?.roomSize?.toString() || "");
  const [sizeUnit, setSizeUnit] = useState<"SQFT" | "SQM">(editingRoom?.sizeUnit || "SQFT");
  const [roomName, setRoomName] = useState(editingRoom?.roomName || "");
  const [numberOfRooms, setNumberOfRooms] = useState(editingRoom?.numberOfRooms || 1);
  const [description, setDescription] = useState(editingRoom?.description || "");

  const handleSubmit = () => {
    if (!roomName || !roomType || !roomView || !roomSize || !sizeUnit) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload: Room = {
      ...(editingRoom ?? {}),
      roomName,
      description,
      numberOfRooms,
      roomSize: parseInt(roomSize),
      sizeUnit,
      roomType,
      roomView,
      hotelId,
    };

    if (editingRoom) {
      // 🔁 Update mode
      updateRoomMutation.mutate(payload, {
        onSuccess: () => alert("Room updated successfully!"),
        onError: () => alert("Failed to update room."),
      });
    } else {
      // 🆕 Create mode
      const { id, ...createPayload } = payload;
      createRoomMutation.mutate(createPayload, {
        onSuccess: () => {
          alert("Room created successfully!");
          // Reset only on create
          setRoomType("");
          setRoomView("");
          setRoomSize("");
          setSizeUnit("SQFT");
          setRoomName("");
          setNumberOfRooms(1);
          setDescription("");
        },
        onError: () => alert("Failed to create room."),
      });
    }
  };

  return (
    <div className="create-room-page">
      <h1 className="page-title-outside">
        {editingRoom ? "Edit Room" : "Create Room"}
      </h1>

      <div className="create-room-wrapper">
        <div className="step-content">
          <h2 className="step-heading">Room Details</h2>
          <p className="step-description">
            Add the name and key features of this room type
          </p>
          <hr />

          {/* Room Type */}
          <div className="form-row">
            <div className="form-label">
              <label>Room type</label>
              <p className="sub-text">Choose the type that best describes this room</p>
            </div>
            <div className="form-input">
              <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                <option value="">Select room type</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>
          <hr />

          {/* Room View */}
          <div className="form-row">
            <div className="form-label">
              <label>Room view</label>
              <p className="sub-text">Describe what the guest will see from this room</p>
            </div>
            <div className="form-input">
              <select value={roomView} onChange={(e) => setRoomView(e.target.value)}>
                <option value="">Select room view</option>
                <option value="Pool">Pool</option>
                <option value="Garden">Garden</option>
                <option value="City">City</option>
              </select>
            </div>
          </div>
          <hr />

          {/* Room Size */}
          <div className="form-row">
            <div className="form-label">
              <label>Room Size (Area)</label>
              <p className="sub-text">Specify the indoor area of the room</p>
            </div>
            <div className="form-input room-size-row">
              <label className="radio-item">
                <input
                  type="radio"
                  name="area"
                  value="SQFT"
                  checked={sizeUnit === "SQFT"}
                  onChange={() => setSizeUnit("SQFT")}
                />
                Square Feet
              </label>
              <label className="radio-item">
                <input
                  type="radio"
                  name="area"
                  value="SQM"
                  checked={sizeUnit === "SQM"}
                  onChange={() => setSizeUnit("SQM")}
                />
                Square Meter
              </label>
              <input
                type="text"
                className="size-input"
                placeholder="Enter size (Area)"
                value={roomSize}
                onChange={(e) => setRoomSize(e.target.value)}
              />
            </div>
          </div>
          <hr />

          {/* Room Name */}
          <div className="form-row">
            <div className="form-label">
              <label>Room Name</label>
              <p className="sub-text">Add a room name that looks attractive to travellers</p>
            </div>
            <div className="form-input">
              <input
                type="text"
                placeholder="Example: Luxury room with private pool"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
          </div>
          <hr />

          {/* Number of Rooms */}
          <div className="form-row">
            <div className="form-label">
              <label>Number of rooms</label>
              <p className="sub-text">Specify how many rooms of this type are at your property</p>
            </div>
            <div className="form-input">
              <input
                type="number"
                placeholder="Enter number"
                value={numberOfRooms}
                onChange={(e) => setNumberOfRooms(parseInt(e.target.value))}
              />
            </div>
          </div>
          <hr />

          {/* Description */}
          <div className="form-row">
            <div className="form-label">
              <label>Description (Optional)</label>
              <p className="sub-text">
                Highlight what makes this room appealing — its view, comfort, and key features.
              </p>
            </div>
            <div className="form-input">
              <textarea
                placeholder="Write the description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <hr />

          {/* Actions */}
          <div className="form-actions">
            <button className="cancel-btn" onClick={() => window.history.back()}>
              Cancel
            </button>
            <button className="next-btn" onClick={handleSubmit}>
              {editingRoom ? "Update Room" : "Create Room"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
