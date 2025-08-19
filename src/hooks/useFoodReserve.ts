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

  const reserve = async ({ selected, mealTypeId, foodTypeId, programId }: UseReserveMealParams) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const token = localStorage.getItem("bearerToken");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        `https://saba.tvu.ac.ir/rest/reserves/${programId}/reserve`,
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
            selectedCount: selected ? 1 : 0,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // Return consistent error format
        return {
          type: "ERROR",
          messageFa: result.messageFa || "خطا در سرور",
          status: response.status
        };
      }

      setData(result);
      return {
        type: "SUCCESS",
        ...result
      };

    } catch (err) {
      // Return consistent error format for network/other errors
      return {
        type: "ERROR",
        messageFa: err instanceof Error ? err.message : "خطای غیرمنتظره رخ داد",
        status: 500
      };
    } finally {
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