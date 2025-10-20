"use client"

import { ChevronDown } from 'lucide-react'
import React from 'react'
import { usePathname } from 'next/navigation'

const pathToTitle: Record<string, string> = {
  '/': 'Dashboard',
  '/management/product-management': 'Products Management',
  '/management/category-management': 'Category Management',
  '/starter-packs': 'Starter Packs',
  '/transactions': 'Transactions',
  '/management/users-management': 'Users Management',
  '/requests': 'Verification Request',
  '/management/report-management': 'Report Management',
  '/management/communication-management': 'Communication Management',
  '/management/banner-management': 'Banners Management',
  '/settings': 'Settings',
}

export default function Header() {
  const pathname = usePathname()
  const title = pathToTitle[pathname] || 'Dashboard'

  return (
    <div className="fixed top-0 left-0 w-full z-40 bg-white shadow-sm p-5 flex md:ml-64 items-center justify-between">
      <h1 className="font-bold text-sm flex-1">
        {title}
      </h1>
      <div className="flex items-center gap-2 ml-4">
        <div className="flex items-center gap-2">
          <img src="https://i.pinimg.com/736x/ed/f2/f0/edf2f0344a86c77a821e9cb711b21ec0.jpg" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover" alt="profile_image" />
          <p className="text-xs sm:text-sm truncate max-w-[120px]">Joanna Adeleke</p>
        </div>
        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
    </div>
  )
}