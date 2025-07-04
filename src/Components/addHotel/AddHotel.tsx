import React, { useState } from "react";
import { Hotel } from "../../type/Hotel";


import "./AddHotel.css";

const AddHotel: React.FC = () => {
  const [hotel, setHotel] = useState<Hotel>({
    hotelId: '',
    hotelName: "",
    hotelAddress: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHotel({ ...hotel, [name]: name === "hotelId" ? parseInt(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // try {
    //   await saveHotel(hotel);
    //   alert("Hotel saved successfully");
    //   setHotel({ hotelId: 0, hotelName: "", hotelAddress: "" });
    // } catch (error: any) {
    //   alert("Error saving hotel: " + (error.response?.data?.message || error.message));
    // }
  };

  return (
    <div className="add-hotel-wrapper">  
    <div className="add-hotel-container">
      <h2>Hotel Deatils</h2>
      <form onSubmit={handleSubmit}>
        
        <input
          type="number"
          name="hotelId"
          placeholder="Hotel ID"
          value={hotel.hotelId}
          onChange={handleChange}
          required
        />

        
        <input
          type="text"
          name="hotelName"
          placeholder="Hotel Name"
          value={hotel.hotelName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="hotelAddress"
          placeholder="Hotel Address"
          value={hotel.hotelAddress}
          onChange={handleChange}
          required
        />

        <button type="submit">Save</button>
      </form>
    </div>
  </div>
  );
};

export default AddHotel;
