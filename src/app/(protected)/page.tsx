"use client";
import { BsFillCheckCircleFill } from "react-icons/bs";
import * as jalaali from 'jalaali-js'; // Add this import at the top

import {
  format,
  addWeeks,
  subWeeks,
  differenceInCalendarWeeks,
  addDays,
  
} from "date-fns";

import { useLogout } from "@/hooks/useLogout";
import { useUserInfo } from "@/hooks/useUserInfo";
import { Button } from "@/components/ui/button";
import {
  CircleCheck,
  CircleChevronLeft,
  CircleChevronRight,
  CircleMinus,
  Loader2,
  SquareArrowLeft,
  SquareArrowRight,
} from "lucide-react";
import { useReserveWithWeekStart } from "@/hooks/useReserveWithWeekStart";
import { useEffect, useMemo, useState } from "react";
import { useForgetCardCodes } from "@/hooks/useForgetCardCodes";
import QRCodeBox from "@/components/ui/QRCodeBox";
import { MealTypeEntry } from "@/types/reserveWithWeekStart";
import { convertToPersian } from "@/utils/convertToPersian";
import { useRouter } from "next/navigation";
import TableSkeleton from "@/components/SkeletonTable";
import SkeletonTable from "@/components/SkeletonTable";
import FoodChart from "@/components/FoodChart";
import useFoodPrograms from "@/hooks/useFoodPrograms";
import Modal from "@/components/ui/Modal";
import { FoodProgramResponse } from "@/types/food-response-types";
import { toJalaali } from "jalaali-js";
import { getPersianWeekRange } from "@/utils/getPersianWeekRange";

export default function HomePage() {
  const { loading, error, data } = useUserInfo();
  
  // Improved week start calculation
  const getStartOfWeek = (date: Date) => {
    const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    // Calculate days to subtract to get to Saturday (start of Persian week)
    const diff = (day + 1) % 7; // Saturday (6) → 0, Sunday (0) → 1, etc.
    const saturday = new Date(date);
    saturday.setDate(saturday.getDate() - diff);
    saturday.setHours(0, 0, 0, 0);
    return saturday;
  };

  const today = new Date();
  const currentWeekSaturday = getStartOfWeek(today);

  // Store as Date object instead of string
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(currentWeekSaturday);

  const router = useRouter();

  // Calculate relative week label (in Persian)
  const weekLabel = useMemo(() => {
    const weekDiff = differenceInCalendarWeeks(
      selectedWeekStart,
      currentWeekSaturday
    );

    if (weekDiff === 0) return "این هفته";
    if (weekDiff === 1) return "هفته بعد";
    if (weekDiff === -1) return "هفته قبل";
    if (weekDiff > 1)
      return `${convertToPersian(weekDiff.toString())} هفته بعد`;
    if (weekDiff < -1)
      return `${convertToPersian(Math.abs(weekDiff).toString())} هفته قبل`;

    return format(selectedWeekStart, "MMMM d, yyyy");
  }, [selectedWeekStart, currentWeekSaturday]);

  // Fixed navigation handlers
  const handleNextWeek = () => {
    setSelectedWeekStart(prev => {
      const nextWeek = new Date(prev);
      nextWeek.setDate(nextWeek.getDate() + 7); // Always add exactly 7 days
      return nextWeek;
    });
  };

  const handlePrevWeek = () => {
    setSelectedWeekStart(prev => {
      const prevWeek = new Date(prev);
      prevWeek.setDate(prevWeek.getDate() - 7); // Always subtract exactly 7 days
      return prevWeek;
    });
  };

  // Format for API only when needed
  const apiFormattedDate = format(selectedWeekStart, "yyyy-MM-dd");

  const {
    data: foodData,
    error: foodError,
    loading: foodLoading,
  } = useFoodPrograms(104, apiFormattedDate);

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

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  if (error) {
    error.includes("40") && router.push("/login");
  }
  const getWeekRangeFromData = (foodData: FoodProgramResponse | undefined) => {
    if (!foodData?.payload?.selfWeekPrograms) return '';
  
    const days = foodData.payload.selfWeekPrograms;
    if (days.length === 0) return '';
  
    // Get first day (Saturday)
    const firstDay = days[0][0]?.date;
    // Get last day (Friday) - last meal of last day
    const lastDay = days[days.length - 1][0]?.date;
  
    if (!firstDay || !lastDay) return '';
  
    // Format dates as "DD/MM" in Persian
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const jalaaliDate = jalaali.toJalaali(date);
      return `${jalaaliDate.jd.toString().padStart(2, '۰')}/${jalaaliDate.jm.toString().padStart(2, '۰')}`;
    };
  
    const firstFormatted = formatDate(firstDay);
    const lastFormatted = formatDate(lastDay);
  
    return `${firstFormatted} تا ${lastFormatted}`;
  };
  const weekRange = getPersianWeekRange(selectedWeekStart);

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
      <div className="flex flex-col items-center justify-center gap-2 mb-4">
        <div className="flex items-center justify-center gap-2">
          <CircleChevronLeft
            className="w-8 h-8 hover:fill-green-200 cursor-pointer"
            onClick={handleNextWeek}
          />

          <h2 className="font-bold" dir="rtl">
            {weekLabel}
          </h2>
          <CircleChevronRight
            className="w-8 h-8 hover:fill-green-200 cursor-pointer"
            onClick={handlePrevWeek}
            />
          
        </div>
            {foodData && (
            <div className="text-sm text-gray-600 mb-2" dir="rtl" >
              {weekRange}
            </div>
          )}
        
        {Math.abs(
          differenceInCalendarWeeks(
            selectedWeekStart,
            currentWeekSaturday
          )
        ) > 1 && (
          <Button
            onClick={() => setSelectedWeekStart(currentWeekSaturday)}
            className="mt-1 hover:bg-green-100 cursor-pointer transition-all duration-300"
            variant="outline"
          >
            بازگشت به این هفته
          </Button>
        )}
      </div>

      <div className="container mx-auto min-h-[300vh] overflow-y-auto bg-white">
        <div className="container mx-auto min-h-[300vh] overflow-y-auto bg-white">
          {foodLoading ? (
            <TableSkeleton />
          ) : foodData && foodData.payload.selfWeekPrograms ? (
            <FoodChart data={foodData} />
          ) : (
            <div className="text-center py-10 text-gray-500">
              اطلاعاتی برای این هفته یافت نشد.
            </div>
          )}
        </div>
      </div>
    </>
  );
}