"use client"
import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { FoodProgramResponse } from '@/types/food-response-types';

// The interface we created earlier
const useFoodPrograms = (selfId: number, date: string) => {
    const [data, setData] = useState<FoodProgramResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Format the date to match the API's expected format (YYYY-MM-DD+00:00:00)
            const formattedDate = `${date.split('T')[0]}+00:00:00`;
            
            const token = localStorage.getItem("bearerToken"); // or whatever your key is

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
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [selfId, date]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = () => {
        fetchData();
    };

    return { data, loading, error, refetch };
};

export default useFoodPrograms;