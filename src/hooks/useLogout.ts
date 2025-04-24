// hooks/useLogout.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToaster } from 'react-hot-toast';
import useUserStore from '@/stores/useUserStore';
import useReserveWithStartWeekStore from '@/stores/useReserveWithStartWeekStore';

interface UseLogoutProps {
  redirectPath?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useLogout({
  redirectPath = '/login',
  onSuccess,
  onError
}: UseLogoutProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const userLogout = useUserStore((state) => state.logout);
  const weekDataClear = useReserveWithStartWeekStore((state) => state.logout);

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call if you need to invalidate server-side token
      // await fetch('/api/auth/logout', { method: 'POST' });
      
      // Clear client-side auth state
      localStorage.removeItem('bearerToken');
      sessionStorage.removeItem('authState'); // if using sessionStorage
      document.cookie = 'token=; Max-Age=0; path=/'; // if using cookies
      userLogout()
      weekDataClear()
      // Optional: Broadcast logout to other tabs
      window.dispatchEvent(new Event('storage'));
      
      // Success handling
      if (redirectPath) {
        router.push(redirectPath);
      }
      
    
      
      if (onSuccess)
        
        
          onSuccess();
        
      return { success: true };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Logout failed');
      setError(error);

      
      if (onError) onError(error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    logout, 
    isLoading, 
    error,
    isError: error !== null
  };
}