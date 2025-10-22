"use client"

import React, { useState } from 'react'

const tabs = [
  { id: 'email', label: 'Email' },
  { id: 'sms', label: 'Sms' },
  { id: 'in-app', label: 'In-App Notifications' },
]

export default function CommunicationSwitchTabNav() {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <div className="bg-white border-gray-200 px-6 py-4 m-2">
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
  )
}