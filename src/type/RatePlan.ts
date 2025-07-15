export interface RatePlan {
  ratePlanId: number; // optional during creation
  ratePlanName: string;
  mealPlan: string;
  roomId: number;
  price?: number;
  currency?: string;
  active?: boolean;
}
