import { useState } from "react";

interface ReserveResponse {
  // Adjust according to the real response
  success: boolean;
  message?: string;
  [key: string]: any;
}

interface UseReserveMealParams {
  selected: boolean;
  mealTypeId: number;
  foodTypeId: number;
  programId:number;
}

export function useFoodReserve() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ReserveResponse | null>(null);

  const reserve = async (
    { selected, mealTypeId, foodTypeId,programId }: UseReserveMealParams  ) => {
    setLoading(true);
    setError(null);

    try {
           const token = localStorage.getItem("bearerToken");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        `https://saba.nus.ac.ir/rest/reserves/${programId}/reserve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
                              'Cache-Control': 'no-cache, no-store, must-revalidate',

          },
          body: JSON.stringify({
            foodTypeId,
            freeFoodSelected: false,
            mealTypeId,
            selected,
            selectedCount: 0,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
if (err instanceof Error) {
  setError(err);
} else {
  setError(new Error("Unknown error occurred"));
}    } finally {
      setLoading(false);
    }
  };

  return {
    reserve,
    data,
    loading,
    error,
  };
}
