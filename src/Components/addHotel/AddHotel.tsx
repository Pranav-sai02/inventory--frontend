import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import "./addHotel.css";
import { useSaveHotel } from "../../hooks/useHotels";
import { Hotel } from "../../type/Hotel";

const AddHotel: React.FC = () => {
  const [hotel, setHotel] = useState<Hotel>({
    hotelId: 0,
    hotelName: "",
    hotelAddress: "",
  });

  const navigate = useNavigate();
  const { mutate: saveHotel, isPending } = useSaveHotel(); // 👈 React Query mutation

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHotel((prev) => ({
      ...prev,
      [name]: name === "hotelId" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hotel.hotelId || !hotel.hotelName.trim() || !hotel.hotelAddress.trim()) {
      alert("All fields are required!");
      return;
    }

    console.log("Saving hotel:", hotel); // Debug log

    saveHotel(hotel, {
      onSuccess: () => {
        alert("✅ Hotel saved successfully!");
        setHotel({ hotelId: 0, hotelName: "", hotelAddress: "" });
      },
      onError: (error) => {
        console.error("❌ Error saving hotel:", error);
        alert("❌ Failed to save hotel.");
      },
    });
  };

  return (
    <div className="add-hotel-wrapper">
      <div className="add-hotel-container">
        <div className="back-button" onClick={() => navigate("/")}>
          ← Back
        </div>

        <h2>Hotel Details</h2>

        <form onSubmit={handleSubmit}>
          <label>Hotel ID</label>
          <input
            type="number"
            name="hotelId"
            value={hotel.hotelId || ""}
            onChange={handleChange}
            required
          />

          <label>Hotel Name</label>
          <input
            type="text"
            name="hotelName"
            value={hotel.hotelName}
            onChange={handleChange}
            required
          />

          <label>Hotel Address</label>
          <input
            type="text"
            name="hotelAddress"
            value={hotel.hotelAddress}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Hotel"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHotel;
