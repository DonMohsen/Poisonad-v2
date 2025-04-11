import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const useUserInfo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('bearerToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/users/me', {
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('bearerToken');
          router.push('/login');
        }
        throw new Error(`Request failed: ${res.status}`);
      }

      const result = await res.json();
      if (!result?.payload) throw new Error('Invalid data format');
      
      setData(result.payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return { loading, error, data, refetch: fetchUserData };
};