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
import { convertToPersian } from '@/utils/convertToPersian';
import { ChevronDown, Wallet } from 'lucide-react';
import { formatNumberWithCommas } from '@/utils/formatNumber';
import { useState } from "react";

export default function Header() {
  const pathname = usePathname()
    const { loading, error, data } = useUserInfo();
    const {error:logoutError,isError,isLoading:logoutLoading,logout}=useLogout()
    const userInfo = useUserStore((state) => state.user);
    const userLogout = useUserStore((state) => state.logout);
    const WeekReserveData = useReserveWithStartWeekStore((state) => state.weekReserveData);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
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
      }finally{

        userLogout()
      }
    };
  const handleUserInfoModal=()=>{
setIsUserModalOpen(!isUserModalOpen)
  }
  return (
    <header className="z-[10000] bg-white sticky top-0  lg:rounded-t-2xl left-0 shadow-xs drop-shadow-xs   flex items-center justify-between px-8 py-2 ">
      <h1 className="text-xl font-semibold">
        {/* {pathname.split('/').pop() || 'New Project'} */}

        {
        WeekReserveData?
        <div className='flex items-center justify-center gap-[2px] '>
          <p className='text-sm'>
            تومان
          </p>
          <p className='font-medium text-sm'>

        {`${convertToPersian(formatNumberWithCommas(WeekReserveData.remainCredit.toString()))}`}
          </p>
          <Wallet className='w-6 h-6' />
        </div>:
        <p>

        </p>
        }
      </h1>
      <div className="flex space-x-4">
        {/* Header actions */}  
       
      </div>
      <div className=''>
        {loading?
      <div>
        loading
      </div>:
      userInfo?
      <div
      onClick={handleUserInfoModal}
      className='flex  items-center justify-center w-full h-full  gap-2 cursor-pointer hover:bg-slate-100 rounded-xl transition-all duration-300'>
              <HiChevronDown  className={`text-[#a3a5a4] w-5 h-5 transition-all duration-300 ${isUserModalOpen&& 'rotate-180'}`} />

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
    </header>
  )
}