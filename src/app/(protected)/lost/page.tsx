"use client";
import { useReserveWithWeekStart } from "@/hooks/useReserveWithWeekStart";
import { CircleCheck, CircleMinus } from "lucide-react";
import React from "react";

const LostPage = () => {
  return (
    <div className="bg-white">
      {/* <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
          {JSON.stringify(reserveData, null, 2)}
        </pre> */}
      {/* <div
        className="w-full h-full grid grid-rows-5 gap-5 p-6 rtl "
        dir="rtl"
      >
        {reserveData?.weekDays.map((day) => (
          
          <div className="flex bg-teal-50 justify-start rounded-2xl items-center" key={day.dayTranslated}>
            <div className="flex flex-col">
              <div className="font-bold">{day.dayTranslated}</div>
              {day.mealTypes?.map((meals) => (
                <div
                className="flex"
                key={meals.reserve.foodTypeTitle}>
                  {meals.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div> */}
    
    </div>
  );
};

export default LostPage;
