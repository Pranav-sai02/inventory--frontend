// src/api/hotels.ts
import { Hotel } from '../type/Hotel';
import axiosInstance from './axiosInstance';


// ✅ Fetch all hotels
export const fetchAllHotels = async (): Promise<Hotel[]> => {
  const response = await axiosInstance.get('/hotels/all');
  return response.data;
};

// ✅ Save hotel
export const saveHotel = async (hotel: Hotel): Promise<Hotel> => {
  const response = await axiosInstance.post('/hotels/saveHotel', hotel);
  return response.data;
};

// ✅ Update hotel
export const updateHotel = async (hotel: Hotel): Promise<Hotel> => {
  const response = await axiosInstance.put('/hotels/update', hotel);
  return response.data;
};

// ✅ Delete hotel
export const deleteHotel = async (hotelId: number): Promise<void> => {
  await axiosInstance.delete(`/hotels/delete/${hotelId}`);
};
