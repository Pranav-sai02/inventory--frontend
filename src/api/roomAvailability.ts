import axiosInstance from './axiosInstance';
import { SaveInventoryRequest } from '../type/roomAvailability';

// ✅ POST inventory data
export const saveRoomsAvailability = async (
  payload: SaveInventoryRequest
): Promise<void> => {
  await axiosInstance.post('/inventory/saveRoomsAvailability', payload);
};
