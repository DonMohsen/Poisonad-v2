import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ReserveWithWeekStart } from '@/types/reserveWithWeekStart';
import useReserveWithStartWeekStore from '@/stores/useReserveWithStartWeekStore';

export const useReserveWithWeekStart = (weekStartDate: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ReserveWithWeekStart|null>(null);
  const router = useRouter();
  const setWeekData = useReserveWithStartWeekStore((state) => state.setWeekReserveData);

  const fetchreserveWithWeekStart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('bearerToken');
      if (!token) {
        router.push('/login');
        return;
      }

      // Use the provided weekStartDate parameter
      const res = await fetch(`https://saba.nus.ac.ir/rest/reserves?weekStartDate=${encodeURIComponent(weekStartDate)}+00:00:00&selfType=NORMAL`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('bearerToken');
          router.push('/');
        }
        throw new Error(`Request failed: ${res.status}`);
      }

      const result = await res.json();
      if (!result?.payload) throw new Error('Invalid data format');
      
      setData(result.payload);
      setWeekData(result.payload);
      // console.log("The reserves results======>>>>>", result);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [router, weekStartDate]); // Add weekStartDate to dependencies

  useEffect(() => {
    if (weekStartDate) {
      fetchreserveWithWeekStart();
    }
  }, [fetchreserveWithWeekStart, weekStartDate]); // Add weekStartDate to dependencies

  return { loading, error, data, refetch: fetchreserveWithWeekStart };
};