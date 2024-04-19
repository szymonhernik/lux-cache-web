import { z } from 'zod';

const CardDetailsSchema = z.object({
  last4: z.string(),
  brand: z.string(),
  exp_year: z.number(),
  exp_month: z.number()
});

const PaymentMethodSchema = z.object({
  id: z.string(),
  card: CardDetailsSchema,
  created: z.number()
});
const SubscriptionSchema = z.object({
  id: z.string(),
  customer: z.string(),
  default_payment_method: PaymentMethodSchema
});

const SubscriptionIdSchema = z.object({
  id: z.string()
});

const CustomerIdSchema = z.object({
  customer: z.string()
});

const ListPaymentMethodSchema = z.array(PaymentMethodSchema);

const LinkedPaymentMethodsSchema = z.object({
  object: z.string(),
  data: ListPaymentMethodSchema
});

const ProductMetadataSchema = z.object({
  index: z.string(),
  trial_allowed: z.string()
});

const CustomerDataSchema = z.object({
  id: z.string(),
  invoice_settings: z.object({
    default_payment_method: z.string()
  })
});

export {
  CardDetailsSchema,
  PaymentMethodSchema,
  LinkedPaymentMethodsSchema,
  CustomerDataSchema,
  CustomerIdSchema,
  SubscriptionSchema,
  SubscriptionIdSchema,
  ListPaymentMethodSchema,
  ProductMetadataSchema
};
