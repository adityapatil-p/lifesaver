import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '../../utils/cn'

export function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen mesh-bg">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div
        className={cn(
          'flex flex-col min-h-screen transition-[margin] duration-300 ease-out',
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        )}
      >
        <Header onMenuClick={() => setMobileOpen(true)} />
        <div className="flex-1 p-4 sm:p-6 overflow-auto scrollbar-thin">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
