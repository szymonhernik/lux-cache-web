import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export interface TrialToPaidConfig {
  trialPriceId: string
  paidPriceId: string
  trialDays: number
  customerId: string
  userId: string
}

/**
 * Creates a subscription schedule that starts with a trial and automatically converts to paid
 * This is the recommended approach for trial-to-paid conversions
 */
export async function createTrialToPaidSchedule({
  trialPriceId,
  paidPriceId,
  trialDays,
  customerId,
  userId
}: TrialToPaidConfig): Promise<Stripe.SubscriptionSchedule> {
  const trialEnd = Math.floor(Date.now() / 1000) + trialDays * 24 * 60 * 60

  const schedule = await stripe.subscriptionSchedules.create({
    customer: customerId,
    start_date: 'now',
    end_behavior: 'release',
    phases: [
      {
        // Trial phase - $0
        items: [
          {
            price: trialPriceId,
            quantity: 1
          }
        ],
        trial_end: trialEnd,
        metadata: {
          phase: 'trial',
          user_id: userId
        }
      },
      {
        // Paid phase - starts after trial ends
        items: [
          {
            price: paidPriceId,
            quantity: 1
          }
        ],
        metadata: {
          phase: 'paid',
          user_id: userId
        }
      }
    ],
    metadata: {
      user_id: userId,
      trial_price_id: trialPriceId,
      paid_price_id: paidPriceId
    }
  })

  return schedule
}

/**
 * Updates an existing subscription schedule to change the paid plan
 */
export async function updateSubscriptionSchedulePaidPlan(
  scheduleId: string,
  newPaidPriceId: string
): Promise<Stripe.SubscriptionSchedule> {
  const schedule = await stripe.subscriptionSchedules.retrieve(scheduleId)

  if (!schedule.phases || schedule.phases.length < 2) {
    throw new Error('Invalid schedule: must have trial and paid phases')
  }

  // Update the paid phase (second phase)
  const updatedPhases: Stripe.SubscriptionScheduleUpdateParams.Phase[] =
    schedule.phases.map((phase, index) => {
      if (index === 1) {
        // Update the paid phase
        return {
          items: [
            {
              price: newPaidPriceId,
              quantity: 1
            }
          ],
          metadata: {
            ...(phase.metadata || {}),
            paid_price_id: newPaidPriceId
          }
        }
      }
      return {
        items: phase.items?.map((item) => ({
          price: typeof item.price === 'string' ? item.price : item.price.id,
          quantity: item.quantity || 1
        })),
        metadata: phase.metadata || {}
      }
    })

  const updatedSchedule = await stripe.subscriptionSchedules.update(
    scheduleId,
    {
      phases: updatedPhases,
      metadata: {
        ...schedule.metadata,
        paid_price_id: newPaidPriceId
      }
    }
  )

  return updatedSchedule
}

/**
 * Cancels a subscription schedule (useful for trial cancellations)
 */
export async function cancelSubscriptionSchedule(
  scheduleId: string,
  reason: 'user_requested' | 'payment_failed' = 'user_requested'
): Promise<Stripe.SubscriptionSchedule> {
  return await stripe.subscriptionSchedules.cancel(scheduleId, {
    invoice_now: false, // Don't invoice immediately
    prorate: false // Don't prorate
  })
}

/**
 * Gets subscription schedule details
 */
export async function getSubscriptionSchedule(
  scheduleId: string
): Promise<Stripe.SubscriptionSchedule> {
  return await stripe.subscriptionSchedules.retrieve(scheduleId)
}

/**
 * Lists all subscription schedules for a customer
 */
export async function listCustomerSubscriptionSchedules(
  customerId: string
): Promise<Stripe.SubscriptionSchedule[]> {
  const schedules = await stripe.subscriptionSchedules.list({
    customer: customerId,
    limit: 100
  })

  return schedules.data
}
