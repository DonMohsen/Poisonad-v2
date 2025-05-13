"use client";
import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { FoodProgramResponse } from '@/types/food-response-types';
import useFoodProgramStore from '@/stores/useFoodProgramStore';

const useFoodPrograms = (selfId: number, date: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const setData = useFoodProgramStore((state) => state.setData);
  const clearData = useFoodProgramStore((state) => state.clearData);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const formattedDate = `${date.split('T')[0]}+00:00:00`;
      const token = localStorage.getItem("bearerToken");
      const response = await axios.get<FoodProgramResponse>(
        `https://saba.nus.ac.ir/rest/programs/v2?selfId=${selfId}&weekStartDate=${formattedDate}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        }
      );

      setData(response.data);
    } catch (err) {
      setError(err as AxiosError);
      clearData();
    } finally {
      setLoading(false);
    }
  }, [selfId, date, setData, clearData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return { loading, error, refetch };
};

export default useFoodPrograms;
