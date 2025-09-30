export interface SubscriptionTiers {
  [key: string]: number
}

// Get product IDs from environment variables
const getSubscriptionTiers = (): SubscriptionTiers => {
  const tiers: SubscriptionTiers = {}

  // Community tier
  if (process.env.STRIPE_PRODUCT_ID_COMMUNITY) {
    tiers[process.env.STRIPE_PRODUCT_ID_COMMUNITY] = 1
  }

  // Regular subscription tier
  if (process.env.STRIPE_PRODUCT_ID_REGULAR) {
    tiers[process.env.STRIPE_PRODUCT_ID_REGULAR] = 2
  }

  // Full access tier
  if (process.env.STRIPE_PRODUCT_ID_FULL_ACCESS) {
    tiers[process.env.STRIPE_PRODUCT_ID_FULL_ACCESS] = 3
  }

  return tiers
}

const subscriptionTiers = getSubscriptionTiers()

export default subscriptionTiers
