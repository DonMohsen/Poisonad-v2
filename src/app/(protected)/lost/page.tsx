"use client"
import FoodChart from '@/components/FoodChart';
import useFoodPrograms from '@/hooks/useFoodPrograms';
import { FoodProgramResponse } from '@/types/food-response-types';
import { convertToPersian } from '@/utils/convertToPersian';
import { formatNumberWithCommas } from '@/utils/formatNumber';
import React from 'react';

const WeeklyFoodTable = () => {
  const{data,error,loading,refetch}=useFoodPrograms(104,'2025-05-03')
  // Get all unique dates from the programs
  const allDates = Array.from(
    new Set(data?.payload.selfWeekPrograms.flat().map(meal => meal.date))
  ).sort();

  // Create a map of reserved programIds
  const reservedMeals = new Set(
    data?.payload.userWeekReserves
      .filter(reserve => reserve.selected)
      .map(reserve => reserve.programId)
  );

  return (
    <div className="overflow-x-auto">
      {data&&
      <FoodChart data={data}/>
}
    </div>
  );
};

export default WeeklyFoodTable;