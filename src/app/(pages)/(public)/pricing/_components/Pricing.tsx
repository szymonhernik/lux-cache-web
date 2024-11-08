// 'use client'

// import { User } from '@supabase/supabase-js'
// import cn from 'classnames'
// import { useRouter, usePathname } from 'next/navigation'
// import { useState } from 'react'
// import {
//   BillingInterval,
//   ProductWithPrices,
//   SubscriptionWithProduct
// } from '@/utils/types'

// import { Button } from '@/components/shadcn/ui/button'
// import { PricesQueryResult } from '@/utils/types/sanity/sanity.types'
// import { CustomPortableTextPages } from '@/components/shared/CustomPortableTextPages'
// import clsx from 'clsx'
// import { toast } from 'sonner'

// interface Props {
//   data: PricesQueryResult | null
//   user: User | null | undefined
//   products: ProductWithPrices[]
//   subscription: SubscriptionWithProduct | null
//   userCanTrial: { can_trial: boolean } | null
// }

// export default function Pricing({
//   data,
//   user,
//   products,
//   subscription,
//   userCanTrial
// }: Props) {
//   const { plansFeatures } = data ?? {}

//   const intervals = Array.from(
//     new Set(
//       products.flatMap((product) =>
//         product?.prices?.map((price) => price?.interval)
//       )
//     )
//   )
//   const router = useRouter()
//   const [billingInterval, setBillingInterval] =
//     useState<BillingInterval>('month')
//   const [priceIdLoading, setPriceIdLoading] = useState<string>()

//   return (
//     <>
//       <h1 className="text-shadow text-sm font-semibold lg:sticky lg:top-0 p-4 lg:p-6 uppercase ">
//         pricing
//       </h1>
//       <section className="">
//         <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
//           <div className="sm:flex sm:flex-col sm:align-center">
//             <h1 className="text-xl font-extrabold  sm:text-center ">
//               Choose your subscription
//             </h1>

//             <div className="relative self-center mt-6  rounded-lg p-0.5 flex sm:mt-8 ">
//               {intervals.includes('month') && (
//                 <button
//                   onClick={() => setBillingInterval('month')}
//                   type="button"
//                   className={`${
//                     billingInterval === 'month'
//                       ? 'relative w-1/2 bg-black  shadow-sm text-primary'
//                       : 'ml-0.5 relative w-1/2 border border-transparent text-neutral-600'
//                   } rounded-md m-1 py-2 text-sm  whitespace-nowrap  focus:z-10 sm:w-auto sm:px-4  uppercase`}
//                 >
//                   Monthly
//                 </button>
//               )}
//               {intervals.includes('year') && (
//                 <button
//                   onClick={() => setBillingInterval('year')}
//                   type="button"
//                   className={`${
//                     billingInterval === 'year'
//                       ? 'relative w-1/2 bg-black  shadow-sm text-primary'
//                       : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-600'
//                   } rounded-md m-1 py-2 text-sm  whitespace-nowrap  focus:z-10 sm:w-auto sm:px-4  uppercase`}
//                 >
//                   annual (Save 15%)
//                 </button>
//               )}
//             </div>
//           </div>
//           <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
//             {products.map((product, index) => {
//               const price = product?.prices?.find(
//                 (price) => price.interval === billingInterval
//               )
//               if (!price) return null

//               const priceString = new Intl.NumberFormat('en-US', {
//                 style: 'currency',
//                 currency: price.currency!,
//                 minimumFractionDigits: 0
//               }).format((price?.unit_amount || 0) / 100)

//               // Determine button text based on trial_allowed in product metadata, user eligibility, and presence of trial_allowed
//               const metadata = product.metadata as { trial_allowed?: boolean }
//               const userCanTrial = userCanTrial?.can_trial
//               let buttonText = 'Subscribe' // Default button text

//               // Check if trial_allowed is explicitly mentioned in metadata
//               if (metadata.hasOwnProperty('trial_allowed')) {
//                 if (metadata.trial_allowed && userCanTrial) {
//                   buttonText = 'Trial' // Both product allows trial and user can trial
//                 } else {
//                   buttonText = '(trial not available) Subscribe' // user can't trial
//                 }
//               }

//               return (
//                 <div
//                   key={product.id}
//                   className={cn(
//                     'flex flex-col rounded-lg shadow-sm  divide-zinc-600 relative',
//                     {
//                       // 'border border-pink-500': subscription
//                       //   ? product.name === subscription?.prices?.products?.name
//                       //   : product.name === 'Premium Subscriber',
//                       'border border-muted-foreground ':
//                         !subscription && product.name === 'Premium Subscriber',
//                       'border border-[#00ffa6] ':
//                         subscription &&
//                         product.name === subscription?.prices?.products?.name
//                     },
//                     'flex-1', // This makes the flex item grow to fill the space
//                     'basis-1/3', // Assuming you want each card to take up roughly a third of the container's width
//                     'max-w-xs' // Sets a maximum width to the cards to prevent them from getting too large
//                   )}
//                 >
//                   {!subscription && product.name === 'Premium Subscriber' && (
//                     <div className="absolute top-0 uppercase italic left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-4 py-1 text-xs text-secondery-foreground">
//                       Most Popular
//                     </div>
//                   )}
//                   {subscription &&
//                     product.name === subscription?.prices?.products?.name && (
//                       <div className="absolute top-0 uppercase italic left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-4 font-semibold py-1 text-xs text-[#00ffa6]">
//                         Active
//                       </div>
//                     )}

//                   <div className="p-6 space-y-8">
//                     <h2 className="text-2xl text-center font-semibold leading-6 text-black">
//                       {product.name}
//                     </h2>
//                     <Button
//                       size={'xl'}
//                       variant={'outline'}
//                       className="w-full font-normal border-black  tracking-tight"
//                       onClick={(e) => {
//                         {
//                           !subscription && !user
//                             ? router.push('/signin/signup')
//                             : !subscription && user
//                               ? router.push(
//                                   '/checkout' + '?priceId=' + price.id
//                                 )
//                               : router.push('/account/subscription')
//                         }
//                       }}
//                     >
//                       {subscription ? (
//                         <span className="font-semibold">Manage</span>
//                       ) : (
//                         <span>
//                           Join for{` `}
//                           <span className="font-semibold">
//                             {' '}
//                             {priceString}/{billingInterval}{' '}
//                           </span>
//                           {` `}
//                           <span className="text-tertiary-foreground">
//                             (VAT incl)
//                           </span>
//                         </span>
//                       )}
//                     </Button>
//                     {plansFeatures && plansFeatures[index].planDescription && (
//                       // @ts-ignore
//                       <CustomPortableTextPages
//                         // @ts-ignore
//                         value={plansFeatures[index].planDescription}
//                       />
//                     )}

//                     {metadata.trial_allowed && (
//                       <Button
//                         type="button"
//                         size={'xl'}
//                         // disabled={!!user && !userCanTrial}
//                         onClick={(e) => {
//                           if (!user) {
//                             router.push('/signin/signup')
//                           } else if (user && !userCanTrial) {
//                             toast.info(
//                               'You have already used your free trial or you have had a subscription before.'
//                             )
//                           } else if (!subscription) {
//                             router.push('/checkout' + '?priceId=' + price.id)
//                           } else {
//                             router.push('/account/subscription')
//                           }
//                         }}
//                         isLoading={priceIdLoading === price.id}
//                         className={clsx(
//                           `block mx-auto  text-sm font-semibold text-center text-white rounded-md `,
//                           !!user &&
//                             !userCanTrial &&
//                             'bg-disabled text-disabled-foreground cursor-not-allowed hover:bg-disabled hover:text-disabled-foreground'
//                         )}
//                       >
//                         Try with Free Trial
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       </section>
//     </>
//   )
// }
