"use client";
import { format, addWeeks, subWeeks, differenceInCalendarWeeks, addDays } from 'date-fns';

import { useLogout } from "@/hooks/useLogout";
import { useUserInfo } from "@/hooks/useUserInfo";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button"; // Assuming you're using shadcn/ui
import { CircleCheck, CircleChevronLeft, CircleChevronRight, CircleMinus, Loader2, SquareArrowLeft, SquareArrowRight } from "lucide-react";
import { useReserveWithWeekStart } from "@/hooks/useReserveWithWeekStart";
import { useEffect, useMemo, useState } from "react";
import { useForgetCardCodes } from "@/hooks/useForgetCardCodes";
import Modal from "@/components/ui/Modal";
import QRCodeBox from "@/components/ui/QRCodeBox";
import { MealTypeEntry } from "@/types/reserveWithWeekStart";
import { convertToPersian } from "@/utils/convertToPersian";
import { useRouter } from "next/navigation";
import TableSkeleton from '@/components/TableSkeleton';

export default function HomePage() {
  const { loading, error, data } = useUserInfo();
  const { logout, isLoading: isLoggingOut, error: logoutError } = useLogout();
  const getStartOfWeek = (date: Date) => {
    const dateCopy = new Date(date);
    const day = dateCopy.getDay(); // 0 (Sun) to 6 (Sat)
    // Calculate difference to previous Saturday
    const diff = dateCopy.getDate() - day - 1; // -1 because Saturday is day 6
    dateCopy.setDate(diff);
    dateCopy.setHours(0, 0, 0, 0);
    return dateCopy;
  };

  // Helper to get the end of week (Friday)
  const getEndOfWeek = (date: Date) => {
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 6); // Add 6 days to Saturday to get Friday
    return endDate;
  };

  const today = new Date();
  const currentWeekSaturday = getStartOfWeek(today);

  // Initialize with the current week's Saturday
  const [selectedWeekStart, setSelectedWeekStart] = useState<string>(
    format(currentWeekSaturday, 'yyyy-MM-dd')
  );

  // Automatically fetches when `selectedWeekStart` changes
  const {
    data: reserveData,
    error: reserveError,
    loading: reserveLoading,
  } = useReserveWithWeekStart(selectedWeekStart);
  const router = useRouter();

  // Calculate relative week label (in Persian)
  const weekLabel = useMemo(() => {
    const selectedDate = new Date(selectedWeekStart);
    const weekDiff = differenceInCalendarWeeks(selectedDate, currentWeekSaturday);

    if (weekDiff === 0) return 'این هفته';
    if (weekDiff === 1) return 'هفته بعد';
    if (weekDiff === -1) return 'هفته قبل';
    if (weekDiff > 1) return `${convertToPersian(weekDiff.toString())} هفته بعد`;
    if (weekDiff < -1) return `${convertToPersian(Math.abs(weekDiff).toString())} هفته قبل`;
    
    return format(selectedDate, 'MMMM d, yyyy');
  }, [selectedWeekStart, currentWeekSaturday]);

  // Get formatted week range (Saturday to Friday)
  const weekRangeLabel = useMemo(() => {
    const startDate = new Date(selectedWeekStart);
    const endDate = getEndOfWeek(startDate);
    return `${format(startDate, 'd MMM')} تا ${format(endDate, 'd MMM')}`;
  }, [selectedWeekStart]);

  // Navigation handlers
  const handleNextWeek = () => {
    const nextWeek = addDays(new Date(selectedWeekStart), 7);
    setSelectedWeekStart(format(nextWeek, 'yyyy-MM-dd'));
  };

  const handlePrevWeek = () => {
    const prevWeek = addDays(new Date(selectedWeekStart), -7);
    setSelectedWeekStart(format(prevWeek, 'yyyy-MM-dd'));
  };


  const [reserveId, setReserveId] = useState<null | number>(null);
  const [modalData, setModalData] = useState<null | MealTypeEntry>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const {
    loading: ForgetCardCodesLoading,
    error: ForgetCardCodesError,
    data: ForgetCardCodesData,
    fetchForgetCardCodes,
  } = useForgetCardCodes();

  const closeQRModal = () => {
    setIsModalOpen(false);
  };

  
  useEffect(() => {
    modalData?.reserve.id && setReserveId(modalData.reserve.id);
  }, [modalData]);
  useEffect(() => {
    reserveId && fetchForgetCardCodes(reserveId.toString());
  }, [reserveId]);
  const handleModalOpened = (meal: MealTypeEntry) => {
    setIsModalOpen(true);
    setModalData(meal);
  };
  const mealOrder = [ "صبحانه", "ناهار" ,"شام","افطاری","سحری"];

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  if (error)
  {error.includes('40')&&router.push('/login')
  }

  return (
    <>
     <Modal open={isModalOpen} onClose={closeQRModal} title="کد فراموشی">
        {ForgetCardCodesLoading ? (
          <div className="animate-pulse bg-slate-200 h-[200px] w-[200px] rounded-md shadow-lg mt-5"></div>
        ) : (
          modalData &&
          reserveId &&
          ForgetCardCodesData?.foodName && (
            <div className="flex items-center justify-center flex-col">
              {modalData.reserve.foodNames}
              {ForgetCardCodesLoading ? (
                <div className="animate-pulse bg-slate-200 h-[200px] w-[200px] rounded-md shadow-lg mt-5"></div>
              ) : (
                <QRCodeBox value={ForgetCardCodesData.forgotCardCode} />
              )}
              <p>{ForgetCardCodesData.forgotCardCode}</p>
            </div>
          )
        )}
      </Modal>
    {/* <Header/> */}
    <div className="container mx-auto  min-h-[300vh] overflow-y-auto bg-white ">
    <div className="p-6 overflow-x-auto" dir="rtl">
  <h1 className="text-2xl font-bold mb-4 text-center">وضعیت رزرو</h1>
  <div className="flex items-center justify-center gap-2 mb-2">
  <CircleChevronRight
  className='w-8 h-8 hover:fill-green-200 cursor-pointer'
   onClick={handlePrevWeek} />

  <h2 className="">
    {weekLabel}
  </h2>
  <CircleChevronLeft className='w-8 h-8 hover:fill-green-200 cursor-pointer'
  onClick={handleNextWeek} />
  </div>
  {Math.abs(differenceInCalendarWeeks(
    new Date(selectedWeekStart),
    currentWeekSaturday
  )) >= 2 && (
    <div className="flex justify-center mt-2">
      <Button 
        variant="outline"
        size="sm"
        onClick={() => setSelectedWeekStart(format(currentWeekSaturday, 'yyyy-MM-dd'))}
        className="text-sm px-4 py-1 cursor-pointer hover:bg-green-200 border border-black/[0.1] mb-3"
      >
        بازگشت به هفته جاری
      </Button>
    </div>
  )}

  {reserveLoading?<TableSkeleton/>:
  (

  <table className="min-w-full border border-gray-300 text-center text-sm">
    <thead>
      <tr>
        <th className="border border-gray-300 min-h-5 max-h-5 bg-gray-100  p-2 sticky right-0">روز</th>
        {mealOrder.map((meal) => (
          <th key={meal} className="border min-h-5 max-h-5 border-gray-300 max-w-10 bg-gray-100 dark:bg-purple-700 p-2">
            {meal}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {reserveData?.weekDays.map((day, index) => {
          const isToday = format(new Date(day.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

        return(
       <tr key={day.date} className={isToday ? 'bg-yellow-50' : ''}>
       {/* Day cell */}
       <td className={`border min-h-5 max-h-5 border-gray-300 max-w-10 font-bold p-2 sticky right-0 ${
         isToday ? 'bg-yellow-100' : index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
       }`}>
         {day.dayTranslated} <br />
         <span className={`text-xs ${isToday ? 'text-yellow-800' : 'text-gray-500'}`}>
           {convertToPersian(day.dateJStr)}
         </span>
       </td>
          
          {/* Meal cells with alternating colors */}
          {mealOrder.map((mealName) => {
            const meal = day?.mealTypes?.find((m) => m.name === mealName);
            return (
              <td key={mealName} className={`border max-w-10 min-h-5 max-h-5 border-gray-300 m-0 ${
                isToday ? 'bg-yellow-50' : index % 2 === 0 ? 'bg-slate-50' : 'bg-slate-100'
              }`}>
    
                <div className="w-full h-full  rounded text-xs">
                  <div className="max-md:hidden">
                    {meal?.reserve.foodNames?
                    <div
                    onClick={() => handleModalOpened(meal)}

                    className="cursor-pointer w-full h-[60px] flex items-center  justify-center transition-all duration-300 hover:bg-slate-200">
                      <CircleCheck className="w-6 h-6 fill-[#378039] text-white cursor-pointer" />
                      {meal.reserve.foodNames}

                    </div>:
                    <div>
                      
                    </div>
                    
                    }
                  </div>
                  <p className="md:hidden flex items-center justify-center">
                    {meal?.reserve?.foodNames ? (
                      <CircleCheck
                      onClick={() => handleModalOpened(meal)}

                      className="w-6 h-6 fill-[#378039] text-white cursor-pointer" />
                    ) : (
                      <CircleMinus className="w-5 h-5 text-slate-500" />
                    )}
                  </p>
                  
                </div>
                
                
              </td>
              
            );
          })}
        </tr>
      )
    }
      )}
    </tbody>
  </table>
  )
  }
</div>
    </div>
    </>

  );
}
