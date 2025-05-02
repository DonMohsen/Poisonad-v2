"use client"
import useFoodPrograms from "@/hooks/useFoodPrograms";

function LostPage() {
    const selfId = 104; // Can be dynamic
    const date = '2025-04-26'; // Can be dynamic
    
    const { data, loading, error, refetch } = useFoodPrograms(selfId, date);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>No data available</div>;
    const allMeals = data.payload.selfWeekPrograms.flat();
    const reservedProgramIds = new Set(
      data.payload.userWeekReserves
        .filter(reserve => reserve.selected)
        .map(reserve => reserve.programId)
    );
    return (
        <div>
            {/* <h1>{data.messageFa}</h1> */}
            {/* <button onClick={refetch}>Refresh Data</button> */}
            
            {/* Render your data here */}
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
          
            <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Day</th>
            <th className="py-2 px-4 border-b">Meal Type</th>
            <th className="py-2 px-4 border-b">Food Name</th>
            <th className="py-2 px-4 border-b">Food Type</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {allMeals.map((meal) => {
            const isReserved = reservedProgramIds.has(meal.programId);
            const rowClass = isReserved ? 'bg-green-50' : '';

            return (
              <tr key={meal.programId} className={rowClass}>
                <td className="py-2 px-4 border-b">{meal.dayTranslated}</td>
                <td className="py-2 px-4 border-b">{meal.mealTypeName}</td>
                <td className="py-2 px-4 border-b">{meal.foodName}</td>
                <td className="py-2 px-4 border-b">{meal.foodTypeTitle}</td>
                <td className="py-2 px-4 border-b">{meal.price.toLocaleString()}</td>
                <td className="py-2 px-4 border-b">
                  {isReserved ? (
                    <span className="text-green-600 font-medium">Reserved</span>
                  ) : (
                    <span className="text-gray-500">Available</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
        </div>
    );
}
export default LostPage