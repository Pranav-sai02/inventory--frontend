// src/type/RatePlanDTO.ts
export interface RatePlans {
  ratePlanId: number;
  roomId: number;
  ratePlanName: string;
  price: number;
  currency: string;
  active: boolean;
}
