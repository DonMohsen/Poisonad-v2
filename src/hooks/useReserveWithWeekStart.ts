import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ReserveWithWeekStart } from '@/types/reserveWithWeekStart';

export const useReserveWithWeekStart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ReserveWithWeekStart|null>(null);
  const router = useRouter();

  const fetchreserveWithWeekStart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('bearerToken');
      if (!token) {
        router.push('/login');
        return;
      }

      // Directly fetch the external endpoint here
      const res = await fetch('https://saba.nus.ac.ir/rest/reserves?weekStartDate=&selfType=NORMAL', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',

        },
        // If SSL bypass is needed in development mode, you can do it like this:
        // agent: new https.Agent({ rejectUnauthorized: false })
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
      console.log("The users/me results======>>>>>",result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      
    }
  }, [router]);

  useEffect(() => {
    fetchreserveWithWeekStart();
  }, [fetchreserveWithWeekStart]);

  return { loading, error, data, refetch: fetchreserveWithWeekStart };
};
