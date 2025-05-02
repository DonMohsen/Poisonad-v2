"use client";
import { BsFillCheckCircleFill } from "react-icons/bs";
import {
  format,
  addWeeks,
  subWeeks,
  differenceInCalendarWeeks,
  addDays,
} from "date-fns";

import { useLogout } from "@/hooks/useLogout";
import { useUserInfo } from "@/hooks/useUserInfo";
import { Button } from "@/components/ui/button"; // Assuming you're using shadcn/ui
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
import Modal from "@/components/ui/Modal";
import QRCodeBox from "@/components/ui/QRCodeBox";
import { MealTypeEntry } from "@/types/reserveWithWeekStart";
import { convertToPersian } from "@/utils/convertToPersian";
import { useRouter } from "next/navigation";
import TableSkeleton from "@/components/SkeletonTable";
import SkeletonTable from "@/components/SkeletonTable";
import FoodChart from "@/components/FoodChart";
import useFoodPrograms from "@/hooks/useFoodPrograms";

export default function HomePage() {
  const { loading, error, data } = useUserInfo();
  const getStartOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = (day + 1) % 7; // Saturday = 6 → diff = 0, Sunday = 0 → diff = 1, etc.
    const saturday = new Date(date);
    saturday.setDate(saturday.getDate() - diff);
    saturday.setHours(0, 0, 0, 0);
    return saturday;
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
    format(currentWeekSaturday, "yyyy-MM-dd")
  );

  const router = useRouter();

  // Calculate relative week label (in Persian)
  const weekLabel = useMemo(() => {
    const selectedDate = new Date(selectedWeekStart);
    const weekDiff = differenceInCalendarWeeks(
      selectedDate,
      currentWeekSaturday
    );

    if (weekDiff === 0) return "این هفته";
    if (weekDiff === 1) return "هفته بعد";
    if (weekDiff === -1) return "هفته قبل";
    if (weekDiff > 1)
      return `${convertToPersian(weekDiff.toString())} هفته بعد`;
    if (weekDiff < -1)
      return `${convertToPersian(Math.abs(weekDiff).toString())} هفته قبل`;

    return format(selectedDate, "MMMM d, yyyy");
  }, [selectedWeekStart, currentWeekSaturday]);

  // Navigation handlers
  const handleNextWeek = () => {
    const nextWeek = addDays(new Date(selectedWeekStart), 7);
    setSelectedWeekStart(format(nextWeek, "yyyy-MM-dd"));
  };

  const handlePrevWeek = () => {
    const prevWeek = addDays(new Date(selectedWeekStart), -7);
    setSelectedWeekStart(format(prevWeek, "yyyy-MM-dd"));
  };
  const {
    data: foodData,
    error: foodError,
    loading: foodLoading,
  } = useFoodPrograms(104, selectedWeekStart);

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
      

        {Math.abs(
          differenceInCalendarWeeks(
            new Date(selectedWeekStart),
            currentWeekSaturday
          )
        ) > 1 && (
          <Button
            onClick={() =>
              setSelectedWeekStart(format(currentWeekSaturday, "yyyy-MM-dd"))
            }
            className="mt-1"
            variant="outline"
          >
            بازگشت به این هفته
          </Button>
        )}
      </div>

      {/* <Header/> */}
      <div className="container mx-auto  min-h-[300vh] overflow-y-auto bg-white ">
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
