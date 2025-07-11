import { useMutation } from '@tanstack/react-query';
import { SaveInventoryRequest } from '../type/roomAvailability';
import { saveRoomsAvailability } from '../api/roomAvailability';
// ✅ Now it's correct

export const useSaveInventory = () => {
  return useMutation({
    mutationFn: (payload: SaveInventoryRequest) => saveRoomsAvailability(payload),
    onSuccess: () => {
      console.log('✅ Inventory saved successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to save inventory:', error);
    },
  });
};
