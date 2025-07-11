// src/api/ratePlanPrices.ts

import { RatePlanPriceDTO } from '../type/RatePlanPriceDto';
import axiosInstance from './axiosInstance';


// ✅ Fetch rates by hotel and date range
export const fetchRatePlanPricesByHotel = async (
  hotelId: number,
  fromDate: string,
  toDate: string
): Promise<RatePlanPriceDTO[]> => {
  const response = await axiosInstance.get('/rate-plan-prices/get-by-hotel', {
    params: {
      hotelId,
      fromDate,
      toDate,
    },
  });
  return response.data;
};

// ✅ Upsert rate plan prices (works like PUT via POST)
export const upsertRatePlanPrices = async (
  payload: RatePlanPriceDTO[]
): Promise<string> => {
  const response = await axiosInstance.post('/rate-plan-prices/rates/update', payload);
  return response.data; // returns "Rates updated successfully."
};
