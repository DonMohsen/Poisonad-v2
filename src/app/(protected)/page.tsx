"use client";
import { useLogout } from "@/hooks/useLogout";
import { useUserInfo } from "@/hooks/useUserInfo";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button"; // Assuming you're using shadcn/ui
import { CircleCheck, CircleMinus, Loader2 } from "lucide-react";
import { useReserveWithWeekStart } from "@/hooks/useReserveWithWeekStart";
import { useEffect, useState } from "react";
import { useForgetCardCodes } from "@/hooks/useForgetCardCodes";
import Modal from "@/components/ui/Modal";
import QRCodeBox from "@/components/ui/QRCodeBox";
import { MealTypeEntry } from "@/types/reserveWithWeekStart";
import { convertToPersian } from "@/utils/convertToPersian";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { loading, error, data } = useUserInfo();
  const { logout, isLoading: isLoggingOut, error: logoutError } = useLogout();
  const router=useRouter()
  const {
    data: reserveData,
    error: reserveError,
    loading: reserveLoading,
  } = useReserveWithWeekStart();
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
  <h1 className="text-2xl font-bold mb-4 text-center">تقویم وعده‌های غذایی</h1>
  <table className="min-w-full border border-gray-300 text-center text-sm">
    <thead>
      <tr>
        <th className="border border-gray-300 bg-gray-100 p-2 sticky right-0">روز</th>
        {mealOrder.map((meal) => (
          <th key={meal} className="border border-gray-300 bg-gray-100 dark:bg-purple-700 p-2">
            {meal}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {reserveData?.weekDays.map((day, index) => (
        <tr key={day.date}>
          {/* Day cell with sticky positioning */}
          <td className={`border border-gray-300 font-bold p-2 sticky right-0 ${
            index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
          }`}>
            {day.dayTranslated} <br />
            <span className="text-xs text-gray-500">{convertToPersian(day.dateJStr)}</span>
          </td>
          
          {/* Meal cells with alternating colors */}
          {mealOrder.map((mealName) => {
            const meal = day?.mealTypes?.find((m) => m.name === mealName);
            return (
              <td key={mealName} className={`border  border-gray-300 m-0 max-md:w-[10%] max-md:h-[10%] ${
                index % 2 === 0 ? 'bg-slate-50' : 'bg-slate-100'
              }`}>
                <div className="w-full h-full px-2 py-1 rounded text-xs">
                  <div className="max-md:hidden">
                    {meal?.reserve.foodNames?
                    <div
                    onClick={() => handleModalOpened(meal)}

                    className="cursor-pointer w-full h-[40px] flex items-center  justify-center transition-all duration-300 hover:bg-slate-200 rounded-xl">
                      <CircleCheck className="w-6 h-6 fill-[#378039] text-white cursor-pointer" />
                      {meal.reserve.foodNames}

                    </div>:
                    <div>
                      بدون رزرو
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
      ))}
    </tbody>
  </table>
</div>
    </div>
    </>

  );
}
