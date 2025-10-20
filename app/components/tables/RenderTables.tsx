import React from 'react'
import ProductsApprove from './ProductsApprove'
import VerificationRequests from './VerificationRequests'
import CoinPurchase from './CoinPurchase'
import Banners from './Banners'

export default function RenderTables() {
  return (
    <>
        <div>
             <ProductsApprove />
             <VerificationRequests />
        </div>
        <div>
            <CoinPurchase />
            <Banners />
        </div>
    </>
  )
}
