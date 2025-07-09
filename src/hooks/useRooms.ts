import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRoomsByHotel, createRoom, updateRoom, deleteRoom } from '../api/rooms';
import { Room } from '../type/room';


// 🔁 UseRooms: Fetch rooms by hotel ID
export const useRooms = (hotelId: number) => {
  return useQuery<Room[]>({
    queryKey: ['rooms', hotelId],
    queryFn: () => fetchRoomsByHotel(hotelId),
    enabled: !!hotelId, // ensures it only runs when hotelId exists
  });
};

// 🧠 UseCreateRoom: Invalidate specific hotel’s rooms on success
export const useCreateRoom = (hotelId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', hotelId] });
    },
  });
};

// 🧠 UseUpdateRoom: Invalidate specific hotel’s rooms on success
export const useUpdateRoom = (hotelId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', hotelId] });
    },
  });
};

// 🧠 UseDeleteRoom: Invalidate specific hotel’s rooms on success
export const useDeleteRoom = (hotelId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', hotelId] });
    },
  });
};
