// src/service/rateplan.service.ts
import axios from 'axios';
import { RatePlans } from '../type/rateplans';
import { Room } from '../type/room';
// ✅ Adjust the path to match your model

const BASE_URL = 'http://localhost:8081/api/rateplans';

/**
 * Fetch all rate plans by room ID
 */
export const fetchRoomsByHotelId = async (hotelId: number): Promise<Room[]> => {
  const response = await axios.get(`${BASE_URL}/byHotel/${hotelId}`);
  return response.data;
};

/**
 * Save a new rate plan
 */
export const saveRatePlan = async (ratePlan: RatePlans): Promise<string> => {
  const response = await axios.post(`${BASE_URL}/saveRatePlan`, ratePlan);
  return response.data;
};

/**
 * Update a rate plan
 */
export const updateRatePlan = async (id: number, ratePlan: RatePlans): Promise<RatePlans> => {
  const response = await axios.put(`${BASE_URL}/${id}`, ratePlan);
  return response.data;
};
