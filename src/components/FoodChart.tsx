import { FoodProgramResponse } from "@/types/food-response-types";
import React, { useState, useMemo, useEffect } from "react";
import jalaali from "jalaali-js";
import Modal from "./ui/Modal";
import QRCodeBox from "./ui/QRCodeBox";
import { useForgetCardCodes } from "@/hooks/useForgetCardCodes";
import { QRCodeBoxSkeleton } from "./ui/QRCodeBoxSkeleton";
import {
  convertToPersianDate,
  convertToPersianNumber,
  convertToPersianWeekday,
} from "@/lib/utils/convertToPersian";
import { ModalTitleColor, ModalTitleColorType } from "@/types/colors";
import { isPastDate } from "@/lib/utils/time-check";
import { CircleMinus, CirclePlus, Info, Minus, Plus, SquarePlus } from "lucide-react";
import { formatNumberWithCommas } from "@/lib/utils/formatNumber";
import { useFoodReserve } from "@/hooks/useFoodReserve";
import useFoodPrograms from "@/hooks/useFoodPrograms";
import { useReserveWithWeekStart } from "@/hooks/useReserveWithWeekStart";
import useReserveWithStartWeekStore from "@/stores/useReserveWithStartWeekStore";
import Loader from "./Loader";
import toast from "react-hot-toast";
import { CustomToast } from "./ui/CustomToast";
import QRCodeWithLogo from "./ui/QrCodeWIthLogo";
interface ReserveParams {
  programId: number;
  foodTypeId: number;
  mealTypeId: number;
  event: React.MouseEvent;
  selected:boolean
}
const FoodChart = ({
  data,
  date,
}: {
  data: FoodProgramResponse;
  date: string;
}) => {
  const [selectedReserve, setSelectedReserve] = useState<
    FoodProgramResponse["payload"]["userWeekReserves"][0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const {
    loading: ForgetCardCodesLoading,
    error: ForgetCardCodesError,
    data: ForgetCardCodesData,
    fetchForgetCardCodes,
  } = useForgetCardCodes();
  const { refetch, loading: foodProgramLoading } = useFoodPrograms(104, date);
  const { refetch: reserveWithWeekStartrefetch } =
    useReserveWithWeekStart("2025-05-12");
  const reserveWithWeekStartData = useReserveWithStartWeekStore(
    (state) => state.weekReserveData
  );
  const reserveWithWeekStartLoading = useReserveWithStartWeekStore(
    (state) => state.loading
  );
  const reserveWithWeekStartError = useReserveWithStartWeekStore(
    (state) => state.error
  );
  const [foodReserveLoad, setFoodReserveLoad] = useState<number | null>(null);

  const {
    reserve,
    data: foodReserveData,
    loading: foodReserveLoading,
    error: foodReserveError,
  } = useFoodReserve();

  const closeQRModal = () => {
    // setSelectedReserve(null);
    setIsModalOpen(false);
  };

  const persianDays = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
  ];
  const mealTypes = [
    { id: 7, name: "ناهار", disPriority: 1 },
    { id: 8, name: "شام", disPriority: 2 },
    { id: 9, name: "افطاری", disPriority: 3 },
    { id: 10, name: "سحری", disPriority: 4 },
  ];

  // Create a map of programId to reserve for quick lookup
  const reserveMap = useMemo(() => {
    const map = new Map<
      number,
      FoodProgramResponse["payload"]["userWeekReserves"][0]
    >();
    data?.payload?.userWeekReserves?.forEach((reserve) => {
      if (reserve.selected) {
        map.set(reserve.programId, reserve);
      }
    });
    return map;
  }, [data]);

  // Helper function to get the corresponding Persian date
  const getPersianDate = (dateString: string) => {
    const date = new Date(dateString);
    const jalaaliDate = jalaali.toJalaali(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
    return `${jalaaliDate.jy}/${jalaaliDate.jm
      .toString()
      .padStart(2, "0")}/${jalaaliDate.jd.toString().padStart(2, "0")}`;
  };

  // Check if a date is today
  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };
  // console.log("selected",selectedReserve);
  const handlModalTitleColor = (
    selectedReserve: FoodProgramResponse["payload"]["userWeekReserves"][0]
  ) => {
    if (selectedReserve.consumed === true) {
      return ModalTitleColor.ORANGE;
    } else if (
      selectedReserve.consumed === false &&
      isPastDate(selectedReserve.programDate)
    ) {
      return ModalTitleColor.RED;
    }
    return ModalTitleColor.GREEN; // default color for consumed items
  };
  const allPrograms = data.payload.selfWeekPrograms.flat();
  const reservableFoods = allPrograms.filter((p) => !p.reserveRuleViolated);

const handlePerformReserve = async ({event, programId, foodTypeId, mealTypeId, selected}: ReserveParams) => {
  event.stopPropagation();
  setFoodReserveLoad(programId);

  const result = await reserve({
    selected,
    mealTypeId,
    foodTypeId,
    programId,
  });

  console.log('Reservation result:', result); // Debug log

  if (result?.type === "SUCCESS") {
    reserveWithWeekStartrefetch();
    refetch();
    toast.custom((t) => (
      <CustomToast t={t} type="success" message={result.messageFa || "رزرو با موفقیت انجام شد"} />
    ));
  } 
  else if (result?.type === "ERROR") {
    toast.custom((t) => (
      <CustomToast t={t} type="error" message={result.messageFa || "خطا در انجام رزرو"} />
    ));
  }

  setFoodReserveLoad(null);
};
  function getFormattedPersianDateFromPrograms(
    programDate: string
  ): string | null {
    for (const dayMeals of data.payload.selfWeekPrograms) {
      for (const meal of dayMeals) {
        if (meal.date === programDate) {
          return getPersianDate(meal.date);
        }
      }
    }
    return null;
  }
  console.log("programs::", data.payload.selfWeekPrograms);

  return (
    <>
      {selectedReserve && (
        <Modal
          open={isModalOpen}
          onClose={closeQRModal}
          title={`جزئیات غذای ${
            selectedReserve.consumed === true
              ? "مصرف شده"
              : selectedReserve.consumed === false &&
                isPastDate(selectedReserve.programDate)
              ? "منسوخ شده"
              : "رزرو شده"
          }`}
          titleLoading={!!ForgetCardCodesLoading}
          titleColor={handlModalTitleColor(selectedReserve)}
          downloadFileName={`${
            ForgetCardCodesData?.meal
          } ${convertToPersianNumber(
            convertToPersianWeekday(selectedReserve?.programDate)
          )}${selectedReserve?.programDate
                  ?(
                      convertToPersianDate(
                        getFormattedPersianDateFromPrograms(
                          selectedReserve.programDate
                        )!
                      )
                    )
                  : null}`}
        >
          <div className="flex items-center justify-center w-full flex-col gap-2">
            <div className=" w-full text-right">
              <p className="font-extrabold mb-2 ">
                {selectedReserve.foodNames}
              </p>
              <div className="font-light mb-2 text-md ">
                {ForgetCardCodesData?.meal}{" "}
                {convertToPersianNumber(
                  convertToPersianWeekday(selectedReserve?.programDate)
                )}
                {selectedReserve?.programDate
                  ? convertToPersianNumber(
                      convertToPersianDate(
                        getFormattedPersianDateFromPrograms(
                          selectedReserve.programDate
                        )!
                      )
                    )
                  : null}
              </div>
              <p className="font-light mb-2 text-sm   ">
                {selectedReserve.selfName}
              </p>
              <p className="font-light mb-2 text-sm ">
                {convertToPersianNumber(
                  selectedReserve.remainedCount.toString()
                )}{" "}
                :تعداد
              </p>
              {/* <p className="font-light mb-2 text-sm ">
                {selectedReserve.consumed === true
                  ? "مصرف شده"
                  : selectedReserve.consumed === false &&
                    isPastDate(selectedReserve.programDate)
                  ? "منسوخ شده"
                  : "رزرو شده"}
              </p> */}
            </div>

            {ForgetCardCodesLoading ? (
              <QRCodeBoxSkeleton />
            ) : ForgetCardCodesData ? (
              // <QRCodeBox value={ForgetCardCodesData?.forgotCardCode} logoUrl="/logo.webp" />
              <QRCodeWithLogo value={ForgetCardCodesData?.forgotCardCode}  logoUrl="/logo.webp" />

            ) : (
              "خطای نامشخص"
            )}
            {ForgetCardCodesLoading ? (
              <p></p>
            ) : ForgetCardCodesError ? (
              <p>خطای نامشخص</p>
            ) : (
              <p>{ForgetCardCodesData?.forgotCardCode}</p>
            )}
          </div>
        </Modal>
      )}

      <div className="overflow-x-auto text-[14px] select-none" dir="rtl">
        <table className="w-full border border-gray-300 max-md:text-[10px] table-fixed">
          <colgroup>
            <col className="w-[60px] md:w-24" />
            {mealTypes.map(() => (
              <col className="w-[80px] md:w-40" key={Math.random()} />
            ))}
          </colgroup>
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 py-3 text-center">روز</th>
              {mealTypes.map((mealType) => (
                <th
                  key={mealType.id}
                  className="border border-gray-300 py-3 text-center"
                >
                  {mealType.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.payload.selfWeekPrograms.map((dayMeals, dayIndex) => {
              const today = dayMeals.some((meal) => isToday(meal.date));
              return (
                <tr key={dayIndex}>
                  <td
                    className={`border border-gray-300 text-center align-middle py-4 ${
                      today ? "bg-yellow-100 font-bold" : "bg-gray-50"
                    } font-medium`}
                  >
                    <div>{persianDays[dayIndex]}</div>
                    <div className="text-[10px] text-gray-600">
                      {convertToPersianNumber(
                        getPersianDate(
                          dayMeals[0]?.date || new Date().toString()
                        )
                      )}
                    </div>
                  </td>

                  {mealTypes.map((mealType) => {
                    const meal = dayMeals.find(
                      (m) => m.mealTypeId === mealType.id
                    );
                    const reserve = meal
                      ? reserveMap.get(meal.programId)
                      : null;
                    const isReserved = !!reserve;
                    const isConsumed = reserve?.consumed;

                    return (
                      <td
                        key={`${dayIndex}-${mealType.id}`}
                        className={`border border-gray-300 relative text-center align-middle py-4 max-md:text-[10px] text-[12px] ${
                          isConsumed
                            ? "bg-orange-50 cursor-pointer hover:bg-orange-100"
                            : isReserved
                            ? "bg-green-50 cursor-pointer hover:bg-green-100"
                            : ""
                        }`}
                        onClick={() => {
                          if (reserve) {
                            setSelectedReserve(reserve);
                            setIsModalOpen(true);
                            fetchForgetCardCodes(reserve.id.toString());
                          } else if (!reserve && meal?.foodId) {
                            console.log(meal.foodName);
                          }
                        }}
                      >
                        {meal && (
                          <div className="h-full flex flex-col px-1">
                            <div className="flex-grow">
                              <div className="font-medium line-clamp-2 h-[30px]">
                                {meal.foodName}
                              </div>
                            </div>

                            {reservableFoods.some(
                              (f) => f.programId === meal.programId
                            ) && (
                              <div
                                onClick={(e) => {
                                  if (foodReserveLoad !== meal.programId) {
                                    e.stopPropagation();
                                    handlePerformReserve({event:e,foodTypeId:meal.foodTypeId,mealTypeId:meal.mealTypeId,programId:meal.programId,selected:!isReserved});
                                  }
                                }}
                                className={`absolute cursor-pointer flex  py-[2px] px-1 items-center justify-center bottom-[2px] right-[2px] bg-transparent backdrop-blur-sm  rounded-full ${!isReserved?'hover:bg-green-100':"hover:bg-red-100"} transition-all ${
                                  foodReserveLoad !== null &&
                                  foodReserveLoad !== meal.programId
                                    ? "opacity-50 pointer-events-none"
                                    : ""
                                }`}
                                   style={{ color: !isReserved?'green':'red' }}
                              >
                                {foodReserveLoad === meal.programId ? <Loader />: (
                                  !isReserved?
                                  <Plus className="text-green-500 w-4 h-4" />:<Minus  className="text-red-500 w-4 h-4" />
                                )}
                                <p className="text-[10px] font-extralight">{convertToPersianNumber(formatNumberWithCommas(meal.price.toString()))}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default FoodChart;
