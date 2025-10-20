import React from 'react'
import Header from '../header/Header'
import AdminAnalytics from '../analytics/AdminAnalytics'
import TransactionsBarChart from '../transactions/TransactionsBarChart'
import RenderTables from '../tables/RenderTables'
import Sidebar from '../sidebar/Sidebar'

export default function RenderHome() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 w-full md:ml-64">
        <Header />
        <AdminAnalytics />
        <TransactionsBarChart />
        <RenderTables />
      </div>
    </div>
  )
}