import React from 'react'
import Header from '../header/Header'
import AdminAnalytics from '../analytics/AdminAnalytics'
import TransactionsBarChart from '../transactions/TransactionsBarChart'
import RenderTables from '../tables/RenderTables'

export default function RenderHome() {
  return (
    <div className="flex">
      <div className="flex-1">
        {/* <Header /> */}
        <AdminAnalytics />
        <TransactionsBarChart />
        <RenderTables />
      </div>
    </div>
  )
}