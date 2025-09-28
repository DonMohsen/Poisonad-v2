'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconType } from 'react-icons' // Assuming you're using react-icons
import { useState } from 'react'
import useRoutes from '@/hooks/useRoutes'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import useSidebarToggle from '@/stores/useSidebarToggle'
import Image from 'next/image'


export default function Sidebar() {
  const router = useRouter()
  const routes=useRoutes();
  // Your route configuration

  return (
    <aside className={`h-full bg-transparent transition-all duration-300 w-[80px]`}>
      <div className="p-4 h-full flex flex-col gap-2">
        {/* Logo/Collapse Header */}
        <div className={`flex items-center justify-center mb-6`}>
         
          
            {/* {!isOpen ? <ChevronRight  /> : <ChevronLeft  />} */}
            <Image 
            onClick={()=>router.push('/')}
            alt='logo' src={'/favicon.svg'} width={500} height={500} className='w-full h-full cursor-pointer' />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4">
          <ul className="space-y-5">
            {routes.map((route) => (
              <li
              key={route.label}>
              <Link className={`flex flex-col gap-2  justify-center cursor-pointer items-center `}
              href={route.href}
              >
                    <route.icon className={clsx(`h-7 w-7 text-[#64ce69] transition-all duration-200`,route.active? 'stroke-3':'stroke-1')} />
                      <p className={clsx(`text-black text-[10px]`,route.active? 'font-bold':'font-medium')}>{route.label}</p>
                      </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Collapse Button */}
      
      </div>
    </aside>
  )
}