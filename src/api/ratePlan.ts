import { RatePlan } from '../type/addRatePlan';
import axiosInstance from './axiosInstance';

// ✅ GET rate plans by roomId
export const fetchRatePlansByRoom = async (roomId: number): Promise<RatePlan[]> => {
  const res = await axiosInstance.get(`/rateplans/room/${roomId}`);
  return res.data;
};

// ✅ CREATE a new rate plan
export const createRatePlan = async (ratePlan: Omit<RatePlan, 'id'>): Promise<void> => {
  await axiosInstance.post('/rateplans/save', ratePlan);
};

// ✅ UPDATE an existing rate plan
export const updateRatePlan = async (ratePlan: RatePlan): Promise<void> => {
  await axiosInstance.put(`/rateplans/${ratePlan.id}`, ratePlan);
};
