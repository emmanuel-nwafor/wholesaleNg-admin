// Updated UserTransactionsSwitchTabs.tsx
"use client"

import React, { useState } from 'react'
import UsersTableTransaction from '../../components/tables/users/transactions-history/UsersTableTransaction'

const tabs = [
  { id: 'Coin Purchases', label: 'Coin Purchases (N)' },
  { id: 'Coin Usage', label: 'Coin Usage (Unlocks)' },
]

interface UserTransactionsSwitchTabsProps {
  userId: string;
}

export default function UserTransactionsSwitchTabs({ userId }: UserTransactionsSwitchTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  const filterType = activeTab === 'Coin Purchases' ? 'CREDIT' : 'DEBIT'

  return (
    <>
        <div className="bg-white border-gray-200 px-9 m-2">
        <div className="flex space-x-1">
            {tabs.map((tab) => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                    ? 'border-b-2 border-gray-500 text-gray-600'
                    : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                }`}
            >
                {tab.label}
            </button>
            ))}
        </div>
        <hr className='text-gray-300'/>
        </div>
        <div className="px-5">
            <UsersTableTransaction userId={userId} filterType={filterType} />
        </div>
    </>
  )
}