import { RatePlan } from '../type/RatePlan';
import axiosInstance from './axiosInstance';

// ✅ GET rate plans by roomId
export const fetchRatePlansByRoom = async (roomId: number): Promise<RatePlan[]> => {
  const res = await axiosInstance.get(`/rateplans/room/${roomId}`);
  return res.data;
};

// ✅ CREATE a new rate plan
export const createRatePlan = async (ratePlan: Omit<RatePlan, 'ratePlanId'>): Promise<void> => {
  await axiosInstance.post('/rateplans/saveRatePlan', ratePlan);
};

// ✅ UPDATE an existing rate plan by ID
export const updateRatePlan = async (ratePlan: RatePlan): Promise<void> => {
  await axiosInstance.put(`/rateplans/update/${ratePlan.ratePlanId}`, ratePlan);
};

// // ✅ DELETE a rate plan by ID (optional, if you add it to backend)
// export const deleteRatePlan = async (id: number): Promise<void> => {
//   await axiosInstance.delete(`/rateplans/${id}`);
// };
