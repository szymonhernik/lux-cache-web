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
  'customer.subscription.deleted'
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
          break
        case 'price.created':
        case 'price.updated':
          await upsertPriceRecord(event.data.object as Stripe.Price)
          break
        case 'invoice.payment_succeeded':
        case 'price.deleted':
          await deletePriceRecord(event.data.object as Stripe.Price)
          break
        case 'product.deleted':
          await deleteProductRecord(event.data.object as Stripe.Product)
          break

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object as Stripe.Subscription
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === 'customer.subscription.created'
          )
          // if (event.type === 'customer.subscription.updated') {
          //   await manageDiscordRoles(
          //     subscription.customer as string,
          //     subscription
          //   )
          // } else if (event.type === 'customer.subscription.deleted') {
          //   await removeDiscordRoles(subscription.customer as string)
          // }
          break

        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session
          if (checkoutSession.mode === 'subscription') {
            const subscriptionId = checkoutSession.subscription
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            )

            // Send email to customer with Resend
            if (
              event.data.object.customer_details === null ||
              event.data.object.customer_details.email === null
            ) {
              throw new Error('Customer details not found')
            } else {
              await resend.emails.send({
                from: 'Lux Cache <hello@szymonhernik.com>',
                to: [event.data.object.customer_details.email],
                subject: 'Thanks for subscribing!',
                react: SubscriptionCompletedEmail()
              })
            }
          } else if (checkoutSession.mode === 'setup') {
            const subscriptionId = checkoutSession.subscription
            console.log('data from checkout session', checkoutSession)
          }
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
