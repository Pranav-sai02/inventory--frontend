// src/hooks/useRatePlanPrices.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRatePlanPricesByHotel, updateRatePlanPrices } from '../api/ratePlanPrices';
import { RatePlanPriceDTO } from '../type/RatePlanPrice';


// Fetch hook
export const useRatePlanPrices = (hotelId: number, fromDate: string, toDate: string) => {
  return useQuery<RatePlanPriceDTO[]>({
    queryKey: ['ratePlanPrices', hotelId, fromDate, toDate],
    queryFn: () => fetchRatePlanPricesByHotel(hotelId, fromDate, toDate),
    enabled: !!hotelId && !!fromDate && !!toDate, // ⛔ prevent firing with invalid inputs
  });
};

// Update hook
export const useUpdateRatePlanPrices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRatePlanPrices,
    onSuccess: () => {
      // ✅ Invalidate cache to refresh data
      queryClient.invalidateQueries({ queryKey: ['ratePlanPrices'] });
    },
    onError: (error) => {
      console.error('Rate update failed:', error);
    },
  });
};
