import { z } from 'zod';

const CardDetailsSchema = z.object({
  last4: z.string(),
  brand: z.string(),
  exp_year: z.number(),
  exp_month: z.number()
});

const PaymentMethodSchema = z.object({
  id: z.string(),
  card: CardDetailsSchema
});
const SubscriptionSchema = z.object({
  id: z.string(),
  customer: z.string(),
  default_payment_method: PaymentMethodSchema
});

const SubscriptionIdSchema = z.object({
  id: z.string()
});

const ListPaymentMethodSchema = z.array(PaymentMethodSchema);

const ProductMetadataSchema = z.object({
  index: z.string(),
  trial_allowed: z.string()
});

export {
  CardDetailsSchema,
  PaymentMethodSchema,
  SubscriptionSchema,
  SubscriptionIdSchema,
  ListPaymentMethodSchema,
  ProductMetadataSchema
};
