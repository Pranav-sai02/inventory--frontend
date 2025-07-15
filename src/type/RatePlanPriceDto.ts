// src/types/RatePlanPrice.ts

export interface RatePlanPriceDTO {
  hotelId: number;
  roomId: number;
  ratePlanId: number;
  date: string; // should be ISO format: YYYY-MM-DD
  availableCount?: number;
  pricePerOne: number;
  pricePerTwo: number;
}
