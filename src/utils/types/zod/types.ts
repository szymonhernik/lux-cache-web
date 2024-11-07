import { z } from 'zod'

const CardDetailsSchema = z.object({
  last4: z.string(),
  brand: z.string(),
  exp_year: z.number(),
  exp_month: z.number()
})

const CardPaymentMethodSchema = z.object({
  id: z.string(),
  card: CardDetailsSchema,
  created: z.number()
})
const SubscriptionSchema = z.object({
  id: z.string(),
  customer: z.string(),
  default_payment_method: CardPaymentMethodSchema
})

const SubscriptionIdSchema = z.object({
  id: z.string()
})

const SubscriptionItemSchema = z.object({
  id: z.string()
})

const CustomerIdSchema = z.object({
  customer: z.string()
})

const StoredPaymentCardsSchema = z.array(CardPaymentMethodSchema)

const LinkedPaymentMethodsSchema = z.object({
  object: z.string(),
  data: StoredPaymentCardsSchema
})

const ProductMetadataSchema = z.object({
  index: z.string(),
  trial_allowed: z.string()
})

const CustomerDataSchema = z.object({
  id: z.string(),
  invoice_settings: z.object({
    default_payment_method: z.string()
  })
})

// FILTER DIALOG

const groupFilterSchema = z.object({
  slug: z.string(),
  title: z.string().nullable()
})

const filterGroupSchema = z.object({
  _id: z.string(),
  title: z.string().nullable(),
  slug: z.string().nullable(),
  groupFilters: z.array(groupFilterSchema).nullable()
})

const FilterGroupsSchema = z.array(filterGroupSchema)

// END OF FILTER DIALOG

export {
  CardDetailsSchema,
  CardPaymentMethodSchema,
  LinkedPaymentMethodsSchema,
  SubscriptionItemSchema,
  CustomerDataSchema,
  CustomerIdSchema,
  SubscriptionSchema,
  SubscriptionIdSchema,
  StoredPaymentCardsSchema,
  ProductMetadataSchema,
  FilterGroupsSchema
}
