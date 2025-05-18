"use client";

import { darkenHexColor, extractHexFromTailwindClass } from "@/lib/utils/colors";
import { ModalTitleColor, ModalTitleColorType } from "@/types/colors";
import { Dialog, Transition } from "@headlessui/react";
import html2canvas from "html2canvas";
import { Fragment, ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  titleLoading: boolean;
  titleColor?: ModalTitleColorType;
   downloadFileName?: string;
};

export default function Modal({
  open,
  titleColor = ModalTitleColor.GREEN,
  onClose,
  children,
  title,
  titleLoading,
  downloadFileName
}: ModalProps) {
const handleDownload = async () => {
  const element = document.getElementById("modal-screenshot");
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
  });

  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = image;
  link.download = `${downloadFileName || "reservation-screenshot"}.png`; // ← uses prop
  link.click();
};
const hex = extractHexFromTailwindClass(titleColor);
const darkHex = hex ? darkenHexColor(hex, 100) : '#000';


  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 select-none" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white text-center shadow-xl transition-all">
              {title && (
                <Dialog.Title
                  className={`text-[15px] font-extrabold text-white w-full flex items-end justify-end ${titleColor} p-4`}
                >
                  {titleLoading ? (
                    <div className="w-full rounded-md bg-slate-200 h-6" />
                  ) : (
                    <div className={`flex items-center justify-center `}
  style={{ color: darkHex }}

                    >
                      {title}
                    </div>
                  )}
                </Dialog.Title>
              )}

              {/* 🟩 Make screenshot target area obvious */}
              <div id="modal-screenshot" className="p-6">
                {children}
              </div>

              {/* 🟦 Buttons at the bottom */}
              <div className="flex justify-between px-6 pb-6 gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  برگشت
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  دانلود تصویر
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
