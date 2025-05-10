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
} from "@/lib/utils/convertToPersian";
import { ModalTitleColor, ModalTitleColorType } from "@/types/colors";
import { isPastDate } from "@/lib/utils/time-check";
import { Plus, SquarePlus } from "lucide-react";
import { formatNumberWithCommas } from "@/lib/utils/formatNumber";

const FoodChart = ({ data }: { data: FoodProgramResponse }) => {
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
  const closeQRModal = () => {
    setIsModalOpen(false);
    // setSelectedReserve(null);
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
  console.log(selectedReserve);
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
  useEffect(() => {
    console.log("data", data);
  }, []);

  console.log(allPrograms);
const handlePerformReserve=(programId:number)=>{
console.log(programId);

}
  return (
    <>
      {selectedReserve && (
        <Modal
          open={isModalOpen}
          onClose={closeQRModal}
          title={`${ForgetCardCodesData?.meal} ${convertToPersianNumber(
            convertToPersianDate(selectedReserve?.programDate)
          )}`}
          titleLoading={!!ForgetCardCodesLoading}
          titleColor={handlModalTitleColor(selectedReserve)}
        >
          <div className="flex items-center justify-center w-full flex-col gap-2">
            <div className=" w-full text-right">
              <p className="font-extrabold mb-2 ">
                {selectedReserve.foodNames}
              </p>
              <p className="font-light mb-2 text-sm   ">
                {selectedReserve.selfName}
              </p>
              <p className="font-light mb-2 text-sm ">
                {convertToPersianNumber(
                  selectedReserve.remainedCount.toString()
                )}{" "}
                :تعداد
              </p>
              <p className="font-light mb-2 text-sm ">
                {selectedReserve.consumed === true
                  ? "مصرف شده"
                  : selectedReserve.consumed === false &&
                    isPastDate(selectedReserve.programDate)
                  ? "منسوخ شده"
                  : "رزرو شده"}
              </p>
            </div>

            {ForgetCardCodesLoading ? (
              <QRCodeBoxSkeleton />
            ) : ForgetCardCodesData ? (
              <QRCodeBox value={ForgetCardCodesData?.forgotCardCode} />
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
                <tr key={dayIndex} className={""}>
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
                        className={`border border-gray-300 text-center align-middle py-4 max-md:text-[10px] text-[12px] ${
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
                          }
                        }}
                      >
                        {meal && (
                          <div className="leading-tight space-y-1 px-1 flex items-center justify-center w-full flex-col ">
                            <div className="font-medium line-clamp-2 h-[26px]">
                              {meal.foodName}
                            </div>
                            <div className="w-full flex items-center justify-center">
                              {reservableFoods.some(
                                (f) => f.programId === meal.programId
                              )
                                ? 
                                <div 
                                onClick={()=>handlePerformReserve(meal.programId)}
                                className="border border-black/[0.3] cursor-pointer max-md:w-full md:w-[50%]  hover:bg-green-100 transition-all duration-300 rounded-md   flex items-center justify-between ">
                                <Plus className="text-green-500 w-full flex items-end justify-end"  />
                                  <p className="w-full font-extrabold  h-full flex items-center justify-center translate-y-[1px]">{convertToPersianNumber(formatNumberWithCommas(meal.price.toString()))}</p>
                                </div>
                                : 
                                <div></div>
                                }
                            </div>
                            {/* {isConsumed && (
                              <div className="text-xs text-orange-600">
                                مصرف شده
                              </div>
                            )}
                            {isReserved && !isConsumed && (
                              <div className="text-xs text-green-600">
                                رزرو شده
                              </div>
                            )} */}
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
