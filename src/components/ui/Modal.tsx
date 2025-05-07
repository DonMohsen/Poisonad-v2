"use client";

import { ModalTitleColor, ModalTitleColorType } from "@/types/colors";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  titleLoading: boolean;
  titleColor?: ModalTitleColorType; // Use the enum type here
};

export default function Modal({
  open,
  titleColor = ModalTitleColor.GREEN,
  onClose,
  children,
  title,
  titleLoading,
}: ModalProps) {

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
                          <Dialog.Title className={`text-lg font-semibold text-white ${titleColor} p-4`}>

                  {" "}
                  {titleLoading ? (
                    <div className="w-full rounded-md bg-slate-200 h-7" />
                  ) : (
                    <div className="flex items-center justify-center text-[#1c3525]">
                      {title}
                    </div>
                  )}
                </Dialog.Title>
              )}
              <div className="p-6">
                {children}
                <button
                  onClick={onClose}
                  className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  برگشت
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
