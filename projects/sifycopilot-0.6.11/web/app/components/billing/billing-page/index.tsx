'use client'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import Loading from '../../base/loading'
import PricingToggle from './PricingToggle'
import { PricingPlan } from './types'
import PricingCard from './PricingCard'
import PricingTable from './PricingTable'
const Billing: FC = () => {
  const [isYearly, setIsYearly] = useState(false)
  const [pricingData, setPricingData] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const fetchPricingData = async () => {
      try {
        const response = await fetch('/pricing_data_test.json')
        const data = await response.json()
        setPricingData(data)
        setIsYearly(data?.pricingPage?.buttonToggle?.isYearly ?? false)
      } catch (error) {
        console.error('Error fetching pricing data:', error)
      }
    }
    fetchPricingData()
  }, [])

  if (!isClient || !pricingData)
    return <Loading />

  const { heading, subheading, plans } = pricingData?.pricingPage ?? {}

  if (!heading || !subheading || !plans || plans.length === 0) {
    return <div className='text-center text-xl'>Pricing Data is not available</div>
  }

  return (
    // <main className='bg-white dark:bg-gray-900'>
    <main className='bg-white dark:bg-[#202020]'>

      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 py-4'>
        <h1 className='text-4xl font-bold mb-4 mt-0 text-gray-900 dark:text-white text-center'>{heading}</h1>
        <p className='text-gray-600 dark:text-gray-300 mb-8 text-center'>{subheading}</p>
        <div className='mb-12'>
          <PricingToggle
            isYearly={isYearly}
            setIsYearly={setIsYearly}
          />
        </div>

        <section className='grid md:grid-cols-3 gap-8 mb-16 '>
          {plans?.map((plan: PricingPlan) => (
            <PricingCard key={plan.name} plan={plan} isYearly={isYearly} />
          ))}
        </section>
        <PricingTable />
      </section>
    </main>
  )
}

export default React.memo(Billing)


// 'use client'
// import type { FC } from 'react'
// import React from 'react'
// import { useTranslation } from 'react-i18next'
// import useSWR from 'swr'
// import PlanComp from '../plan'
// import { ReceiptList } from '../../base/icons/src/vender/line/financeAndECommerce'
// import { LinkExternal01 } from '../../base/icons/src/vender/line/general'
// import { fetchBillingUrl } from '@/service/billing'
// import { useAppContext } from '@/context/app-context'
// import { useProviderContext } from '@/context/provider-context'

// const Billing: FC = () => {
//   const { t } = useTranslation()
//   const { isCurrentWorkspaceManager } = useAppContext()
//   const { enableBilling } = useProviderContext()
//   const { data: billingUrl } = useSWR(
//     (!enableBilling || !isCurrentWorkspaceManager) ? null : ['/billing/invoices'],
//     () => fetchBillingUrl().then(data => data.url),
//   )

//   return (
//     <div>
//       <PlanComp loc={'billing-page'} />
//       {enableBilling && isCurrentWorkspaceManager && billingUrl && (
//         <a className='mt-5 flex px-6 justify-between h-12 items-center bg-gray-50 rounded-xl cursor-pointer' href={billingUrl} target='_blank' rel='noopener noreferrer'>
//           <div className='flex items-center'>
//             <ReceiptList className='w-4 h-4 text-gray-700' />
//             <div className='ml-2 text-sm font-normal text-gray-700'>{t('billing.viewBilling')}</div>
//           </div>
//           <LinkExternal01 className='w-3 h-3' />
//         </a>
//       )}
//     </div>
//   )
// }

// export default React.memo(Billing)
