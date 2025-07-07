import React from "react";
import "./CreateRoom.css";

const CreateRoom: React.FC = () => {
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
              <select>
                <option>Select room type</option>
                <option>Deluxe</option>
                <option>Suite</option>
                <option>Standard</option>
              </select>
            </div>
          </div>
          <hr />

          {/* Room View */}
          <div className="form-row">
            <div className="form-label">
              <label>Room view</label>
              <p className="sub-text">Describe what the guest will see from this room, like pool, garden, or city views.</p>
            </div>
            <div className="form-input">
              <select>
                <option>Select room view</option>
                <option>Pool</option>
                <option>Garden</option>
                <option>City</option>
              </select>
            </div>
          </div>
          <hr />

          {/* Room Size */}
          <div className="form-row">
            <div className="form-label">
              <label>Room Size (Area)</label>
              <p className="sub-text">Specify the indoor area of the room in square units, exclude shared spaces</p>
            </div>
            <div className="form-input room-size-row">
              <label className="radio-item">
                <input type="radio" name="area" /> Square Feet
              </label>
              <label className="radio-item">
                <input type="radio" name="area" /> Square Meter
              </label>
              <input
                type="text"
                className="size-input"
                placeholder="Enter size (Area)"
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
                defaultValue={1}
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
              <textarea placeholder="Write the description"></textarea>
            </div>
          </div>
          <hr />

          {/* Actions */}
          <div className="form-actions">
            <button className="cancel-btn">Cancel</button>
            <button className="next-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
