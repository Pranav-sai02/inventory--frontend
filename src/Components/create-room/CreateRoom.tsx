import React, { useState } from "react";
import "./CreateRoom.css";
import { useCreateRoom } from "../../hooks/useRooms";
import { Room } from "../../type/room";

const CreateRoom: React.FC = () => {
  const hotelId = 111; // ✅ static for now
  const createRoomMutation = useCreateRoom(hotelId);

  const [roomType, setRoomType] = useState("");
  const [roomView, setRoomView] = useState("");
  const [roomSize, setRoomSize] = useState(""); // string input, converted to number
  const [sizeUnit, setSizeUnit] = useState<"SQFT" | "SQM">("SQFT");
  const [roomName, setRoomName] = useState("");
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!roomName || !roomType || !roomView || !roomSize || !sizeUnit) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload: Omit<Room, "id"> = {
      roomName,
      description,
      numberOfRooms,
      roomSize: parseInt(roomSize),
      sizeUnit,
      roomType,
      roomView,
      hotelId,
    };

    createRoomMutation.mutate(payload, {
      onSuccess: () => {
        alert("Room created successfully!");
        setRoomType("");
        setRoomView("");
        setRoomSize("");
        setSizeUnit("SQFT");
        setRoomName("");
        setNumberOfRooms(1);
        setDescription("");
      },
      onError: () => {
        alert("Failed to create room.");
      },
    });
  };

  return (
    <div className="create-room-page">
      <h1 className="page-title-outside">Create Room</h1>

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
              <label>Room Name as shown on MakeMyTrip & its partner websites</label>
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
              <label>Number of rooms (of this type)</label>
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
              <label>Description of the room (Optional)</label>
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
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
