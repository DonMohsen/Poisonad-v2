import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ReserveWithWeekStart } from '@/types/reserveWithWeekStart';
import useReserveWithStartWeekStore from '@/stores/useReserveWithStartWeekStore';

export const useReserveWithWeekStart = (weekStartDate: string) => {
  const router = useRouter();

  const data = useReserveWithStartWeekStore((state) => state.weekReserveData);
  const setWeekData = useReserveWithStartWeekStore((state) => state.setWeekReserveData);
  const setError = useReserveWithStartWeekStore((state) => state.setError);
  const setLoading = useReserveWithStartWeekStore((state) => state.setLoading);

  const fetchReserveWithWeekStart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('bearerToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(
        `https://saba.tvu.ac.ir/rest/reserves?weekStartDate=${encodeURIComponent(weekStartDate)}+00:00:00&selfType=NORMAL`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('bearerToken');
          router.push('/');
        }
        throw new Error(`Request failed: ${res.status}`);
      }

      const result = await res.json();
      if (!result?.payload) throw new Error('Invalid data format');

      setWeekData(result.payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [router, weekStartDate, setWeekData, setError, setLoading]);

  useEffect(() => {
    if (weekStartDate) {
      fetchReserveWithWeekStart();
    }
  }, [fetchReserveWithWeekStart, weekStartDate]);

  return { data, refetch: fetchReserveWithWeekStart };
};
