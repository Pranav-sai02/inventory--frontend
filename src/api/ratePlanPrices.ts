// src/api/ratePlanPrices.ts

import { RatePlanPriceDTO } from '../type/RatePlanPrice';
import axiosInstance from './axiosInstance';
// Import RatePlanPrice type from its definition file
; // Adjust the path as needed

// ✅ Fetch rates by hotel and date range
export const fetchRatePlanPricesByHotel = async (
  hotelId: number,
  fromDate: string,
  toDate: string
): Promise<RatePlanPriceDTO[]> => {
  const response = await axiosInstance.get('/rate-plan-prices/get-by-hotel', {
    params: { hotelId, fromDate, toDate },
  });
  return response.data;
};

// ✅ Update rates (bulk update)
export const updateRatePlanPrices = async (
  rates: RatePlanPriceDTO[]
): Promise<void> => {
  await axiosInstance.put('/rate-plan-prices/rates/update', rates);
};
