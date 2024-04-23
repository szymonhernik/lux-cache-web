import { Tables } from 'types_db';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}

interface ExtendedProductMetadata {
  index?: string;
  trial_allowed?: string;
}

// Omit the original 'metadata' from Product and add the new one.
// type ProductWithFlexibleMetadata = Omit<Product, 'metadata'> & {
//   metadata?: ExtendedProductMetadata;
// };

interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null;
      })
    | null;
};

type BillingInterval = 'lifetime' | 'year' | 'month';

type CheckoutResponse = {
  errorRedirect?: string;
  sessionId?: string;
};

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
};

// type ExtendedProduct = Product & {
//   metadata: {
//     trial_allowed?: 'true' | undefined;
//     index?: '0' | '1' | '2' | undefined;
//   };
// };
