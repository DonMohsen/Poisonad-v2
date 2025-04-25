// store/useSidebarToggle.ts
import { create } from 'zustand'

interface SidebarToggleType {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

const COOKIE_KEY = 'sidebar-collapsed'

const setSidebarCookie = (isOpen: boolean) => {
  // Save as 'true' if collapsed (sidebar closed)
  document.cookie = `${COOKIE_KEY}=${!isOpen}; path=/`
}

const useSidebarToggle = create<SidebarToggleType>((set, get) => ({
  isOpen: true, // or false based on initial preference
  toggle: () => {
    const current = get().isOpen
    set({ isOpen: !current })
    setSidebarCookie(!current)
  },
  open: () => {
    set({ isOpen: true })
    setSidebarCookie(true)
  },
  close: () => {
    set({ isOpen: false })
    setSidebarCookie(false)
  },
}))

export default useSidebarToggle
