'use client'
import { HiChevronDown } from "react-icons/hi";

import { useLogout } from '@/hooks/useLogout';
import { useUserInfo } from '@/hooks/useUserInfo';
import useUserStore from '@/stores/useUserStore';
import { usePathname } from 'next/navigation'
import { CustomToast } from './ui/CustomToast';
import toast from 'react-hot-toast';
import Image from 'next/image';
import useReserveWithStartWeekStore from '@/stores/useReserveWithStartWeekStore';
import { ChevronDown, Loader2, LogOut, Wallet } from 'lucide-react';
import { formatNumberWithCommas } from '@/lib/utils/formatNumber';
import { useEffect, useState } from "react";
import UserModal from "./ui/UserModal";
import { convertToPersianNumber } from "@/lib/utils/convertToPersian";
import { useReserveWithWeekStart } from "@/hooks/useReserveWithWeekStart";
import Loader from "./Loader";

export default function Header() {
  const { loading, error, data } = useUserInfo();
  const {error:logoutError,isError,isLoading:logoutLoading,logout}=useLogout()
  const userInfo = useUserStore((state) => state.user);
  const userLogout = useUserStore((state) => state.logout);
  const WeekReserveData = useReserveWithStartWeekStore((state) => state.weekReserveData);
    const WeekReserveLoading = useReserveWithStartWeekStore((state) => state.loading);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  

  const handleLogout = async () => { 
      try {
        await logout();
        toast.custom((t) => (
          <CustomToast t={t} type="success" message="! خروج موفقیت آمیز" />
        ));
      } catch (err) {
        toast.custom((t) => (
          <CustomToast t={t} type="error" message="خطا ! لطفا مجددا امتحان کنید" />
        ));
      }finally{

        userLogout()
      }
    };
    const handleUserInfoModal = (e: React.MouseEvent) => {
      setIsUserModalOpen((prev) => !prev);
    };
    
  return (
    <header className="z-[10000] bg-white dark:bg-purple-950 sticky top-0  lg:rounded-t-2xl left-0 shadow-xs drop-shadow-xs   flex items-center justify-between px-8 py-2 ">
      <h1 className="text-xl font-semibold">

        {/* {pathname.split('/').pop() || 'New Project'} */}

        {
        WeekReserveData?
        <div className='flex items-center justify-center gap-[2px] '>
          <div className='text-sm'>
            تومان
          </div>
          <div className='font-medium text-sm'>

        {`${convertToPersianNumber(formatNumberWithCommas(WeekReserveData.remainCredit.toString()))}`}
          </div>
          <Wallet className='w-6 h-6' />
        </div>:
        WeekReserveLoading?
        <div className='flex items-center justify-center gap-[2px] '>
          <div className='text-sm'>
            تومان
          </div>
          <div className='font-medium text-sm'>
            <Loader/>
        {/* {`${convertToPersianNumber(formatNumberWithCommas(WeekReserveData.remainCredit.toString()))}`} */}
          </div>
          <Wallet className='w-6 h-6' />
        </div>
        :
        <p>

        </p>
        }
      </h1>
      <div className="flex space-x-4">
        {/* Header actions */}  
       
      </div>
      <div className='select-none'>
        {loading?
      <div>
        loading
      </div>:
      userInfo?
      <div
      className={`flex  items-center justify-center relative w-full h-full  gap-2 cursor-pointer hover:bg-slate-100 rounded-xl transition-all duration-300`}>
              <HiChevronDown  className={`text-[#a3a5a4] w-5 h-5 transition-all duration-300 ${isUserModalOpen&& 'rotate-180'}`} />
          <div 
                onClick={handleUserInfoModal}

          className={`${isUserModalOpen && 'hidden'} absolute left-0 top-0 w-full h-full bg-transparent`}>

          </div>
        <div className='flex flex-col gap-[1px] items-end justify-center text-[12px] '>

        <p className='w-full h-full text-right font-extrabold'>

      {`${userInfo.firstName} ${userInfo.lastName}`}
        </p>
        <p className=' text-right font-light'>
          {userInfo.birthPlace}
        </p>
        </div>
        {userInfo.gender==="مرد"?
        <Image alt='man-placeholder' src="/man-placeholder.jpg" width={200} height={200} className='w-10 h-10 rounded-full'/>
      :
      <Image alt='woman-placeholder' src="/woman-placeholder.jpg" width={200} height={200} className='w-10 h-10 rounded-full'/>

      }
      </div>  :
      <div className='flex items-center justify-center w-full h-full  gap-2'>
        <div className='flex flex-col gap-[1px] items-end justify-center text-[12px] '>

<p className='w-full h-full text-right font-extrabold'>

!وارد شوید
</p>
<p className=' text-right font-light h-[14px] bg-slate-100 w-full rounded-3xl'>
 
</p>
</div>
      <Image alt='unknownUser-placeholder' src="/unknownUser-placeholder.png" width={200} height={200} className='w-10 h-10 rounded-full'/>
      </div>
      }
      </div>
      {/* <button onClick={handleLogout}>
        {logoutLoading?"Loading":"Logout"}
      </button> */}
      
        <UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} >
          {userInfo?
          
        
        <div
      className={`flex flex-col  items-center justify-center relative w-full h-full  gap-2  rounded-xl transition-all duration-300`}>
        {/* //!Profile and name with underline: */}
        <div className="flex items-center justify-center gap-4 pt-4 pb-1 pr-4 pl-10 ">

        
          <div 
                onClick={handleUserInfoModal}

          className={`${isUserModalOpen && 'hidden'} absolute left-0 top-0 w-full h-full bg-transparent`}>

          </div>
        <div className='flex flex-col gap-[1px] items-end justify-center text-[20px] '>

        <p className='w-full h-full text-right dark:text-pink-700 font-extrabold'>

      {`${userInfo.firstName} ${userInfo.lastName}`}
        </p>
        
        </div>
        
        {userInfo.gender==="مرد"?
        <Image alt='man-placeholder' src="/man-placeholder.jpg" width={200} height={200} className='w-16 h-16 rounded-full'/>
      :
      <Image alt='woman-placeholder' src="/woman-placeholder.jpg" width={200} height={200} className='w-16 h-16 rounded-full'/>

      }
      </div>
      <div className="w-full h-[1px] px-0 bg-black/[0.1] rounded-full"/>
      <div className="w-full justify-end items-center flex pr-4">

      </div>
     <div className="flex items-center justify-start w-full p-2">
      <button 
      className="flex items-center group border rounded-xl p-2 border-black/[0.1] justify-center gap-1 cursor-pointer"
      onClick={handleLogout}>
      <LogOut className="rotate-180  group-hover:-translate-x-1 transition-all duration-300 text-red-500"  />
      {logoutLoading?"...":"خروج"}
      
      </button>
     </div>
      </div>
      :
      <div>
        
      </div>
      }
              </UserModal>

    </header>
  )
}