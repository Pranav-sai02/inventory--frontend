// src/types/RatePlanPrice.ts
export interface RatePlanPriceDTO {
  hotelId: number;
  roomId: number;
  ratePlanId: number;
  date: string; // ISO format, e.g., '2025-07-10'
  pricePerOne: number;
  pricePerTwo: number;
}
