import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ReserveWithWeekStart } from '@/types/reserveWithWeekStart';
import { ForgetCardCodeResponseType } from '@/types/forget-card-code.types';

export const useForgetCardCodes = () => {
  const [loading, setLoading] = useState(true); // Start as false
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ForgetCardCodeResponseType | null>(null);
  const router = useRouter();

  const fetchForgetCardCodes = useCallback(async (reserveId: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('bearerToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(
        `https://saba.nus.ac.ir/rest/forget-card-codes/print?reserveId=${reserveId}&count=1&dailySale=false`,
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
      console.log("result of forget code:",result);
      
      setData(result.payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      
      setLoading(false);
    }
  }, [router]);

  return { 
    loading, 
    error, 
    data, 
    fetchForgetCardCodes // Now requires reserveId parameter
  };
};