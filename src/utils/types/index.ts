import { Tables } from 'types_db'

type Subscription = Tables<'subscriptions'>
type Product = Tables<'products'>
type Price = Tables<'prices'>

interface ProductMetadata {
  trial_allowed?: boolean
  default_paid_price?: string
  [key: string]: any
}

interface ProductWithPrices extends Product {
  prices: Price[]
  metadata: ProductMetadata | null
}
interface PriceWithProduct extends Price {
  products: Product | null
}

interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null
}

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null
      })
    | null
}

type BillingInterval = 'lifetime' | 'year' | 'month'

type CheckoutResponse = {
  errorRedirect?: string
  sessionId?: string
}

export type CanAcessType = boolean | null

export type {
  SubscriptionWithPriceAndProduct,
  Price,
  Subscription,
  Product,
  BillingInterval,
  ProductWithPrices,
  PriceWithProduct,
  SubscriptionWithProduct,
  CheckoutResponse
}
