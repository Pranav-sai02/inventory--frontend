
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRatePlan, fetchRatePlansByRoom, updateRatePlan } from '../api/ratePlan';
import { RatePlan } from '../type/addRatePlan';

// ✅ Fetch all rate plans for a given roomId
export const useRatePlansByRoom = (roomId: number) => {
  return useQuery<RatePlan[]>({
    queryKey: ['ratePlans', roomId],
    queryFn: () => fetchRatePlansByRoom(roomId),
    enabled: !!roomId, // only run if roomId is valid
  });
};

// ✅ Create a rate plan
export const useCreateRatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRatePlan,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ratePlans', variables.roomId] });
    },
  });
};

// ✅ Update a rate plan
export const useUpdateRatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRatePlan,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ratePlans', variables.roomId] });
    },
  });
};
