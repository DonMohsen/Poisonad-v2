"use client";
import { useLogout } from "@/hooks/useLogout";
import { useUserInfo } from "@/hooks/useUserInfo";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button"; // Assuming you're using shadcn/ui
import { Loader2 } from "lucide-react";
import { useReserveWithWeekStart } from "@/hooks/useReserveWithWeekStart";
import { useEffect, useState } from "react";
import { useForgetCardCodes } from "@/hooks/useForgetCardCodes";
import Modal from "@/components/ui/Modal";
import QRCodeBox from "@/components/ui/QRCodeBox";
import { MealType } from "@/types/forget-card-code.types";
import { MealTypeEntry } from "@/types/reserveWithWeekStart";
import Header from "@/components/Header";
import { CustomToast } from "@/components/ui/CustomToast";
import useReserveWithStartWeekStore from "@/stores/useReserveWithStartWeekStore";

export default function DashboardPage() {
  const { loading, error, data } = useUserInfo();
  const { logout, isLoading: isLoggingOut, error: logoutError } = useLogout();
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
  const handleLogout = async () => {
    try {
      await logout();
      toast.custom((t) => (
        <CustomToast t={t} type="success" message="Item created successfully!" />
      ));
          } catch (err) {
      toast.custom((t) => (
        <CustomToast t={t} type="error" message="Something went wrong!" />
      ));
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <>
    {/* <Header/> */}
    <div className="container mx-auto p-4 min-h-[300vh] overflow-y-auto bg-white ">
      {/* <Toaster  position="top-center" /> */}

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
          ) : (
            "Logout"
          )}
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
      <div className="bg-green-300">
        {/* <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
          {JSON.stringify(reserveData, null, 2)}
        </pre> */}
      </div>
      <div>
        {reserveData?.weekDays.map((day) => (
          <div key={day.day}>
            {day.mealTypes?.map((meal) => (
              <div
                className="cursor-pointer"
                onClick={() => handleModalOpened(meal)}
                key={meal.reserve.key}
              >
                {meal.reserve.foodNames}
                {/* {ForgetCardCodesLoading && <Loader2></Loader2>} */}
              </div>
            ))}
          </div>
        ))}
      </div>
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
      <div>
        {ForgetCardCodesError && <div className="error">{error}</div>}
        {ForgetCardCodesData && (
          <div>
            {ForgetCardCodesData.forgotCardCode}
            {/* <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
              {JSON.stringify(ForgetCardCodesData, null, 2)}
            </pre> */}
          </div>
        )}
      </div>
    </div>
    </>

  );
}
