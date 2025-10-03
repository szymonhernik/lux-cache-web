export interface SubscriptionTiers {
  [key: string]: number
}
const subscriptionTiers = {
  prod_T9slHQQQERIuaC: 1, // Community
  prod_T9sm5pPMRarp6j: 2, // Regular Subscription
  prod_T9tvcp8YmsO8Xw: 3 // Full Access
}

export default subscriptionTiers
// export interface SubscriptionTiers {
//   [key: string]: number
// }

// // Get product IDs from environment variables
// const getSubscriptionTiers = (): SubscriptionTiers => {
//   const tiers: SubscriptionTiers = {}

//   console.log('Environment variables:')
//   console.log(
//     'STRIPE_PRODUCT_ID_COMMUNITY:',
//     process.env.STRIPE_PRODUCT_ID_COMMUNITY
//   )
//   console.log(
//     'STRIPE_PRODUCT_ID_REGULAR:',
//     process.env.STRIPE_PRODUCT_ID_REGULAR
//   )
//   console.log(
//     'STRIPE_PRODUCT_ID_FULL_ACCESS:',
//     process.env.STRIPE_PRODUCT_ID_FULL_ACCESS
//   )

//   // Community tier
//   if (process.env.STRIPE_PRODUCT_ID_COMMUNITY) {
//     tiers[process.env.STRIPE_PRODUCT_ID_COMMUNITY] = 1
//   }

//   // Regular subscription tier
//   if (process.env.STRIPE_PRODUCT_ID_REGULAR) {
//     tiers[process.env.STRIPE_PRODUCT_ID_REGULAR] = 2
//   }

//   // Full access tier
//   if (process.env.STRIPE_PRODUCT_ID_FULL_ACCESS) {
//     tiers[process.env.STRIPE_PRODUCT_ID_FULL_ACCESS] = 3
//   }

//   console.log('Final tiers object:', tiers)
//   return tiers
// }

// const subscriptionTiers = getSubscriptionTiers()

// export default subscriptionTiers
