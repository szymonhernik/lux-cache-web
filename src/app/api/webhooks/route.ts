import Stripe from 'stripe'
import { stripe } from '@/utils/stripe/config'
import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
  deleteProductRecord,
  deletePriceRecord
} from '@/utils/supabase/admin'
import { Resend } from 'resend'
import SubscriptionCompletedEmail from '@/components/emails/SubscriptionCompletedEmail'
import { createClient } from '@/utils/supabase/server'
import { revalidateTag } from 'next/cache'
import SubscriptionCancelEmail from '@/components/emails/SubscriptionCancelEmail'

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'product.deleted',
  'price.created',
  'price.updated',
  'price.deleted',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'subscription_schedule.created',
  'subscription_schedule.updated',
  'subscription_schedule.completed',
  'subscription_schedule.canceled',
  'subscription_schedule.released'
])

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(req: Request, res: Response) {
  console.log('hello')
  return new Response(JSON.stringify({ received: true }))
}

export async function POST(req: Request) {
  console.log('Webhook endpoint hit')
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event: Stripe.Event
  const supabase = createClient()

  try {
    if (!sig || !webhookSecret)
      return new Response('Webhook secret not found.', { status: 400 })
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    console.log(`🔔  Webhook received: ${event.type}`)
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProductRecord(event.data.object as Stripe.Product)
          revalidateTag('products') // Add revalidation here
          break
        case 'price.created':
        case 'price.updated':
          await upsertPriceRecord(event.data.object as Stripe.Price)
          revalidateTag('products') // Add revalidation here
          break
        case 'invoice.payment_succeeded':
        case 'price.deleted':
          await deletePriceRecord(event.data.object as Stripe.Price)
          revalidateTag('products') // Add revalidation here
          break
        case 'product.deleted':
          await deleteProductRecord(event.data.object as Stripe.Product)
          revalidateTag('products') // Add revalidation here
          break

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
        case 'customer.subscription.resumed':
          const subscription = event.data.object as Stripe.Subscription
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === 'customer.subscription.created'
            // event.type === 'customer.subscription.updated'
          )
          if (event.type === 'customer.subscription.updated') {
            if (subscription.cancel_at_period_end) {
              // Get customer details
              const customerId = subscription.customer as string // Extract the customer ID
              const customer = (await stripe.customers.retrieve(
                customerId
              )) as Stripe.Customer

              const userName = customer.name
              const userEmail = customer.email
              if (!userEmail) {
                throw new Error('Customer email not found')
              }

              // Send cancellation email
              await resend.emails.send({
                from: 'Lux Cache <no-reply@luxcache.com>',
                to: [userEmail],
                subject: '💟 Confirming the end of your Lux Cache Subscription',
                react: SubscriptionCancelEmail(userEmail, userName)
              })
            }
          }
          break

        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session
          if (checkoutSession.mode === 'subscription') {
            const subscriptionId = checkoutSession.subscription

            // Check if this is a trial subscription that needs to be converted to a schedule
            if (checkoutSession.metadata?.trial_to_paid_price_id) {
              const trialToPaidPriceId =
                checkoutSession.metadata.trial_to_paid_price_id
              const userId = checkoutSession.metadata.user_id

              try {
                // Convert the trial subscription to a subscription schedule
                const { createTrialToPaidSchedule } = await import(
                  '@/utils/stripe/subscription-schedules'
                )

                // Get the trial price ID from the subscription instead of checkout session
                const subscription = await stripe.subscriptions.retrieve(
                  subscriptionId as string
                )
                const trialPriceId = subscription.items.data[0]?.price?.id

                if (!trialPriceId) {
                  console.error('Trial price ID is missing from subscription')
                  return
                }

                if (!trialToPaidPriceId) {
                  console.error(
                    'Target paid price ID is missing from checkout session'
                  )
                  return
                }

                // Get the payment method from the subscription

                const paymentMethodId =
                  subscription.default_payment_method as string

                // console.log(
                //   'Got payment method from subscription:',
                //   paymentMethodId
                // )

                if (!paymentMethodId) {
                  console.warn(
                    'No payment method found for subscription schedule'
                  )
                }

                const schedule = await createTrialToPaidSchedule({
                  trialPriceId,
                  paidPriceId: trialToPaidPriceId,
                  trialDays: 7,
                  customerId: checkoutSession.customer as string,
                  userId: userId,
                  defaultPaymentMethod: paymentMethodId || undefined
                })

                // console.log(
                //   `Converted trial subscription to schedule: ${schedule.id}`
                // )
              } catch (error) {
                console.error('Error converting trial to schedule:', error)
              }
            }

            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            )
            const userEmail = event.data.object.customer_details?.email

            // Send email to customer with Resend
            if (event.data.object.customer_details === null || !userEmail) {
              throw new Error('Customer details not found')
            } else {
              const userName = event.data.object.customer_details.name
              await resend.emails.send({
                from: 'Lux Cache <no-reply@luxcache.com>',
                to: [userEmail],
                subject: 'You successfully subscribed to Lux Cache',
                react: SubscriptionCompletedEmail(userEmail, userName)
              })
            }
          } else if (checkoutSession.mode === 'setup') {
            const subscriptionId = checkoutSession.subscription
            console.log('data from checkout session', checkoutSession)
          }
          break

        case 'subscription_schedule.created':
          console.log('Subscription schedule created:', event.data.object.id)
          // Handle subscription schedule creation if needed
          break

        case 'subscription_schedule.updated':
          console.log('Subscription schedule updated:', event.data.object.id)
          // Handle subscription schedule updates if needed
          break

        case 'subscription_schedule.completed':
          console.log('Subscription schedule completed:', event.data.object.id)
          // This happens when the trial period ends and converts to paid
          // The subscription is automatically created by Stripe
          break

        case 'subscription_schedule.canceled':
          console.log('Subscription schedule canceled:', event.data.object.id)
          // Handle trial cancellation if needed
          break

        case 'subscription_schedule.released':
          console.log('Subscription schedule released:', event.data.object.id)
          // Handle when a schedule is released (converted to regular subscription)
          break
        default:
          throw new Error('Unhandled relevant event!')
      }
    } catch (error) {
      console.log(error)
      return new Response(
        'Webhook handler failed. View your Next.js function logs.',
        {
          status: 400
        }
      )
    }
  } else {
    return new Response(`Unsupported event type: ${event.type}`, {
      status: 400
    })
  }
  return new Response(JSON.stringify({ received: true }))
}
