// src/hooks/useRatePlanPrices.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRatePlanPricesByHotel, upsertRatePlanPrices } from '../api/ratePlanPrices';
import { RatePlanPriceDTO } from '../type/RatePlanPriceDto';


export const useRatePlanPrices = (hotelId: number, fromDate: string, toDate: string) => {
  return useQuery<RatePlanPriceDTO[]>({
    queryKey: ['ratePlanPrices', hotelId, fromDate, toDate],
    queryFn: () => fetchRatePlanPricesByHotel(hotelId, fromDate, toDate),
    enabled: !!hotelId && !!fromDate && !!toDate,
  });
};

export const useUpdateRatePlanPrices = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RatePlanPriceDTO[]) => upsertRatePlanPrices(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratePlanPrices'] });
    },
  });
};
