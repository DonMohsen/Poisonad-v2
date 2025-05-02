const TableSkeleton = () => {
    const mealOrder = ['صبحانه', 'ناهار', 'شام']; // Adjust based on your actual mealOrder
    
    return (
      <table className="min-w-full border border-gray-300 text-center text-sm animate-pulse">
        <thead>
          <tr>
            <th className="border border-gray-300 min-h-5 max-h-5 bg-gray-100 p-2 sticky right-0">
              <div className="h-4 w-16 bg-gray-300 rounded mx-auto"></div>
            </th>
            {mealOrder.map((meal) => (
              <th key={meal} className="border min-h-5 max-h-5 border-gray-300 max-w-10 bg-gray-100 p-2">
                <div className="h-4 w-16 bg-gray-300 rounded mx-auto"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(7)].map((_, index) => (
            <tr key={index}>
              {/* Day cell skeleton */}
              <td className={`border min-h-5 max-h-5 border-gray-300 max-w-10 p-2 sticky right-0 ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
              }`}>
                <div className="space-y-1">
                  <div className="h-4 w-12 bg-gray-300 rounded mx-auto"></div>
                  <div className="h-3 w-10 bg-gray-200 rounded mx-auto"></div>
                </div>
              </td>
              
              {/* Meal cells skeleton */}
              {mealOrder.map((mealName) => (
                <td key={`${index}-${mealName}`} className={`border max-w-10 min-h-5 max-h-5 border-gray-300 m-0 ${
                  index % 2 === 0 ? 'bg-slate-50' : 'bg-slate-100'
                }`}>
                  <div className="w-full h-full rounded text-xs">
                    {/* Desktop skeleton */}
                    <div className="max-md:hidden">
                      <div className="w-full h-[60px] flex items-center justify-center">
                        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                    {/* Mobile skeleton */}
                    <div className="md:hidden flex items-center justify-center h-10">
                      <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  export default TableSkeleton