import { z } from 'zod';

export const CardDetailsSchema = z.object({
  last4: z.string(),
  brand: z.string(),
  exp_year: z.number(),
  exp_month: z.number()
});

export const PaymentMethodSchema = z.object({
  id: z.string(),
  card: CardDetailsSchema
});

export const ListPaymentMethodSchema = z.array(PaymentMethodSchema);
