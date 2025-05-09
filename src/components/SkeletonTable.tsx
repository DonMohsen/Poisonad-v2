import React from 'react';

const FoodChartSkeleton = () => {
  const persianDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه'];
  const mealTypes = [
    { id: 7, name: 'ناهار', disPriority: 1 },
    { id: 8, name: 'شام', disPriority: 2 },
    { id: 9, name: 'افطاری', disPriority: 3 },
    { id: 10, name: 'سحری', disPriority: 4 }
  ];

  return (
    <div className="overflow-x-auto text-[14px]" dir="rtl">
      <table className="w-full border border-gray-300 max-md:text-[10px] table-fixed">
        <colgroup>
          <col className="w-[60px] md:w-24" />
          {mealTypes.map(() => <col className="w-[80px] md:w-40" key={Math.random()} />)}
        </colgroup>
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 py-3 text-center">روز</th>
            {mealTypes.map(mealType => (
              <th key={mealType.id} className="border border-gray-300 py-3 text-center">
                {mealType.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {persianDays.map((day, dayIndex) => (
            <tr key={dayIndex}>
              <td className="border border-gray-300 text-center align-middle py-4 bg-gray-50 font-medium">
                {day}
                <div className='w-full animate-pulse  h-4  flex items-center justify-center text-center '>
                <p className='bg-slate-100 rounded-sm animate-pulse w-[50%] h-3'>

                </p>

                </div>

              </td>

              {mealTypes.map(mealType => (
                <td
                  key={`${dayIndex}-${mealType.id}`}
                  className="border border-gray-300 text-center align-middle py-4 max-md:text-[10px] text-[12px]"
                >
                  <div className="leading-tight space-y-1 px-1">
                    <div className="font-medium line-clamp-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-3/4"></div>
                    </div>
                    <div className="text-[0.6rem] md:text-xs text-gray-500">
                      <div className="h-3 bg-gray-200 rounded animate-pulse mx-auto w-1/2"></div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodChartSkeleton;