export interface Reserve {
    id: number;
    programId: number;
    programDate: string;
    groupId: number;
    consumed: boolean;
    selfId: number;
    selfCodeName: string;
    selfCode: string;
    selfName: string;
    mealTypeId: number;
    foodId: number;
    foodTypeId: number;
    foodTypeTitle: string;
    foodNames: string;
    besideFoodNames: string;
    selectedCount: number;
    remainedCount: number;
    selected: boolean;
    forSale: boolean;
    sold: boolean;
    freeFoodSelected: boolean;
    deleteAsSellFreeFood: boolean;
    decreasedSelectedCountAsSellFreeFood: boolean;
    userId: number;
    price: number;
    consumedSubsidyPrice: number;
    changableSelf: boolean;
    selfChangeToll: number;
    saleableFreeFood: boolean;
    saleableFreeFoodToll: number;
    key: string;
    fullName: string;
    timeDistanceUntilToday: number;
    programDateTime: number;
    programDateStr: string;
    priorReserveDateStr: string;
  }
  
  export interface MealTypeEntry {
    mealTypeId: number;
    name: string;
    date: string;
    reserve: Reserve;
    dateTime: number;
  }
  
  export interface WeekDay {
    day: string;
    dayTranslated: string;
    date: string;
    dateJStr: string;
    mealTypes?: MealTypeEntry[];
  }
  
  export interface MealType {
    id: number;
    name: string;
    canPanelDisplay: boolean;
    disPriority: number;
    selectFoodTypeIds: string;
    selfType: string;
  }
  
  export interface ReserveWithWeekStart {
    weekDays: WeekDay[];
    mealTypes: MealType[];
    remainCredit: number;
  }
  