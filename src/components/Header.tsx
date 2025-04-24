'use client'

import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  
  return (
    <header className="bg-black sticky top-0 rounded-md left-0  flex items-center justify-between">
      <h1 className="text-xl font-semibold">
        {pathname.split('/').pop() || 'New Project'}
      </h1>
      <div className="flex space-x-4">
        {/* Header actions */}
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Share
        </button>
      </div>
    </header>
  )
}