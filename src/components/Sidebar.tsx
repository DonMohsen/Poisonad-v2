'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconType } from 'react-icons' // Assuming you're using react-icons
import { useState } from 'react'
import useRoutes from '@/hooks/useRoutes'
import { ChevronLeft, ChevronRight } from 'lucide-react'


export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const routes=useRoutes();
  // Your route configuration

  return (
    <aside className={`h-full bg-transparent transition-all duration-300   ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      <div className="p-4 h-full flex flex-col gap-2">
        {/* Logo/Collapse Header */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-6`}>
          {!isCollapsed && <h2 className="text-xl font-semibold">YourLogo</h2>}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {isCollapsed ? <ChevronRight  /> : <ChevronLeft  />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1">
          <ul className="space-y-1">
            {routes.map((route) => (
              <li key={route.label}>
                <Link
                  href={route.href}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    route.active
                      ? 'bg-blue-50 text-blue-600' 
                      : 'hover:bg-gray-100'
                  } ${
                    isCollapsed ? 'justify-center' : 'justify-start'
                  }`}
                >
                  <route.icon className="text-lg" />
                  {!isCollapsed && (
                    <span className="ml-3">{route.label}</span>
                  )}
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