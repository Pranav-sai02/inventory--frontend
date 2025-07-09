export interface RatePlan {
  id?: number;            // Optional during creation
  ratePlanName: string;   // e.g., "EP", "CP"
  mealPlan: string;       // e.g., "FREE Breakfast", "All Meals Included"
  roomId: number;         // Room to which the rate plan is linked
}