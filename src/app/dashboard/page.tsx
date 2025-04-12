"use client"
import { useLogout } from '@/hooks/useLogout';
import { useUserInfo } from '@/hooks/useUserInfo';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button'; // Assuming you're using shadcn/ui
import { Loader2 } from 'lucide-react';
import { useReserveWithWeekStart } from '@/hooks/useReserveWithWeekStart';
import { useState } from 'react';
import { useForgetCardCodes } from '@/hooks/useForgetCardCodes';

export default function DashboardPage() {
  const { loading, error, data } = useUserInfo();
  const { logout, isLoading: isLoggingOut, error: logoutError } = useLogout();
  const { data:reserveData,error:reserveError,loading:reserveLoading } = useReserveWithWeekStart();
  // const [reserveId, setReserveId] = useState<null|string>(null);
  const { loading:ForgetCardCodesLoading, error:ForgetCardCodesError, data:ForgetCardCodesData, fetchForgetCardCodes } = useForgetCardCodes();
  const handleForgetCardCodes = (reserveId:string) => {
    if (reserveId) {
      fetchForgetCardCodes(reserveId);
    }
  };
  const handleLogout = async () => {
    const toastId = toast.loading('Logging out...');
    try {
      await logout();
      toast.success('Logged out successfully!', { id: toastId });
    } catch (err) {
      toast.error(
        logoutError?.message || 'Failed to logout. Please try again.', 
        { id: toastId }
      );
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="p-4 text-red-500">
      Error: {error}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-center" />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <Button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="destructive"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging Out...
            </>
          ) : 'Logout'}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          {data?.firstName} {data?.lastName}
        </h2>
        
        <div className="mt-4">
          <h3 className="font-medium mb-2">Profile Details:</h3>
          {/* <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre> */}
        </div>
      </div>
      <div className='bg-green-300'>
      {/* <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
            {JSON.stringify(reserveData, null, 2)}
          </pre> */}
      </div>
      <div>
        {reserveData?.weekDays.map((day)=>
        (
          <div key={day.day}>
            {day.mealTypes?.map((meal)=>(
              <div className='cursor-pointer'
              onClick={()=>handleForgetCardCodes(meal.reserve.id.toString())}
              key={meal.reserve.key}>
                {meal.reserve.foodNames}
                {ForgetCardCodesLoading&&<Loader2></Loader2>}
              </div>
            ))}
          </div>
        )
        )}
      </div>
      <div>
      
     
      
      {ForgetCardCodesError && <div className="error">{error}</div>}
      {ForgetCardCodesData && <div>
            {ForgetCardCodesData.forgotCardCode}
        {/* <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
             {JSON.stringify(ForgetCardCodesData, null, 2)}
           </pre> */}
      </div>
          }
    </div>
    </div>
  );
}