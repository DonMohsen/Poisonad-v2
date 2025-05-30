export interface FoodProgramResponse {
    type: string;
    code: number;
    message: string;
    messageFa: string;
    messageResource: string;
    payload: {
        userId: number;
        selfWeekPrograms: Array<Array<{
            programId: number;
            groupId: number;
            date: string;
            selfId: number;
            mealTypeId: number;
            mealTypeName: string;
            foodTypeId: number;
            foodTypeTitle: string;
            foodId: number;
            foodName: string;
            dayTranslated: string;
            validTotalCount: number;
            price: number;
            hideInPanel: boolean;
            programFoodTypes: Array<{
                programDate: string;
                programId: number;
                foodTypeId: number;
                mealTypeId: number;
                foodTypeTitle: string;
                foodList: Array<{
                    id: number;
                    name: string;
                    averageScore: number;
                    voteCount: number;
                    subsidyPercentage?: number;
                }>;
                price: number;
                validMinCount: number;
                validMaxCount: number;
                hideInPanel: boolean;
                fullName: string;
                foodId: number;
                foodNames: string;
                besideFoodNames: string;
                standardFoodNames: string;
                hasCountSetting: boolean;
            }>;
            daysDifferenceWithToday: number;
            cancelRuleViolated: boolean;
            reserveRuleViolated: boolean;
            buyableFreeFood: boolean;
            buyableFreeFoodToll: number;
            dateTime: number;
        }>>;
        userWeekReserves: Array<{
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
        }>;
        mealTypes: Array<{
            id: number;
            name: string;
            disPriority: number;
        }>;
    };
}