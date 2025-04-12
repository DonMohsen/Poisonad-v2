/**
 * Represents a meal reservation with forget card code information
 * 
 * @property {string} username - User identifier (e.g., "01221095705009")
 * @property {string} self - Location description (e.g., "پسران قزوین_ سایت نجف اباد")
 * @property {MealType} meal - Type of meal (e.g., "شام")
 * @property {FoodCostType} foodType - Cost category of the food (e.g., "پر هزینه")
 * @property {string} foodName - Name of the food item (e.g., "کتلت گوشت|")
 * @property {number} count - Total number of reservations
 * @property {number} remainCount - Remaining available reservations
 * @property {boolean} valid - Whether the reservation is currently valid
 * @property {string} forgotCardCode - Unique code for the forgotten card (e.g., "926409497")
 */
export type ForgetCardCodeResponseType = {
    username: string;
    self: string;
    meal: MealType;
    foodType: FoodCostType;
    foodName: string;
    count: number;
    remainCount: number;
    valid: boolean;
    forgotCardCode: string;
  };
  
  /**
   * Type representing possible meal times
   * 
   * Can be extended as needed when new meal types are added to the system
   */
  export type MealType = 
    | "صبحانه" // Breakfast
    | "ناهار"  // Lunch
    | "شام"    // Dinner
    | "سحری"   // Suhoor (Ramadan)
    | "افطاری" // Iftar (Ramadan)
    | string;  // Fallback for future values
  
  /**
   * Type representing food cost categories
   * 
   * Can be extended as needed when new cost types are added
   */
  export type FoodCostType = 
    | "پر هزینه"   // High cost
    | "کم هزینه"   // Low cost
    | "رایگان"     // Free
    | "نیم بها"    // Half price
    | string;      // Fallback for future values
  
  /**
   * Extended type that includes week start information
   * (Maintaining compatibility with your existing ReserveWithWeekStart type)
   */
  export type ReserveWithWeekStart = ForgetCardCodeResponseType & {
    weekStart?: Date; // Optional week start date
    // Add any other additional properties your app needs
  };