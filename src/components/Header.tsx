'use client'

import { useLogout } from '@/hooks/useLogout';
import { useUserInfo } from '@/hooks/useUserInfo';
import useUserStore from '@/stores/useUserStore';
import { usePathname } from 'next/navigation'
import { CustomToast } from './ui/CustomToast';
import toast from 'react-hot-toast';
import Image from 'next/image';
import useReserveWithStartWeekStore from '@/stores/useReserveWithStartWeekStore';
import { convertToPersian } from '@/utils/convertToPersian';
import { Wallet } from 'lucide-react';
import { formatNumberWithCommas } from '@/utils/formatNumber';

export default function Header() {
  const pathname = usePathname()
    const { loading, error, data } = useUserInfo();
    const {error:logoutError,isError,isLoading:logoutLoading,logout}=useLogout()
    const userInfo = useUserStore((state) => state.user);
    const userLogout = useUserStore((state) => state.logout);
    const WeekReserveData = useReserveWithStartWeekStore((state) => state.weekReserveData);

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
  
  return (
    <header className="bg-white sticky top-0 lg:rounded-t-2xl left-0 shadow-xs drop-shadow-xs   flex items-center justify-between px-8 py-2 ">
      <h1 className="text-xl font-semibold">
        {/* {pathname.split('/').pop() || 'New Project'} */}

        {
        WeekReserveData?
        <div className='flex items-center justify-center gap-[2px] '>
          <Wallet className='w-6 h-6' />
          <p className='font-medium text-sm'>

        {convertToPersian(formatNumberWithCommas(WeekReserveData.remainCredit.toString()))}
          </p>
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
      <div className='flex items-center justify-center w-full h-full bg-slate-50 gap-2'>
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
      <div>
        login first
      </div>
      }
      </div>
      {/* <button onClick={handleLogout}>
        {logoutLoading?"Loading":"Logout"}
      </button> */}
    </header>
  )
}