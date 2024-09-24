import { toDateTime } from '@/utils/helpers'
import { stripe } from '@/utils/stripe/config'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import type { Database, Tables, TablesInsert } from 'types_db'

type Product = Tables<'products'>
type Price = Tables<'prices'>
interface ExtendedStripePrice extends Stripe.Price {
  description?: string | null
}

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 7

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function getDiscordIntegration(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('discord_integration')
    .select('connection_status')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching Discord integration:', error)
    return null
  }

  return data
}

export async function updateDiscordIntegration(
  userId: string,
  updateData: Partial<Tables<'discord_integration'>>
) {
  const { error } = await supabaseAdmin.from('discord_integration').upsert({
    user_id: userId,
    ...updateData
  })

  if (error) {
    console.error('Error updating Discord integration:', error)
    throw error
  }
}

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata
  }

  const { error: upsertError } = await supabaseAdmin
    .from('products')
    .upsert([productData])
  if (upsertError)
    throw new Error(`Product insert/update failed: ${upsertError.message}`)
  console.log(`Product inserted/updated: ${product.id}`)
}

const upsertPriceRecord = async (
  price: ExtendedStripePrice,
  retryCount = 0,
  maxRetries = 3
) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : '',
    metadata: price.metadata ?? null,
    description: price.description ?? null,
    active: price.active,
    currency: price.currency,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS
  }

  const { error: upsertError } = await supabaseAdmin
    .from('prices')
    .upsert([priceData])

  if (upsertError?.message.includes('foreign key constraint')) {
    if (retryCount < maxRetries) {
      console.log(`Retry attempt ${retryCount + 1} for price ID: ${price.id}`)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await upsertPriceRecord(price, retryCount + 1, maxRetries)
    } else {
      throw new Error(
        `Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`
      )
    }
  } else if (upsertError) {
    throw new Error(`Price insert/update failed: ${upsertError.message}`)
  } else {
    console.log(`Price inserted/updated: ${price.id}`)
  }
}

const deleteProductRecord = async (product: Stripe.Product) => {
  const { error: deletionError } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', product.id)
  if (deletionError)
    throw new Error(`Product deletion failed: ${deletionError.message}`)
  console.log(`Product deleted: ${product.id}`)
}

const deletePriceRecord = async (price: Stripe.Price) => {
  const { error: deletionError } = await supabaseAdmin
    .from('prices')
    .delete()
    .eq('id', price.id)
  if (deletionError)
    throw new Error(`Price deletion failed: ${deletionError.message}`)
  console.log(`Price deleted: ${price.id}`)
}

const upsertCustomerToSupabase = async (uuid: string, customerId: string) => {
  const { error: upsertError } = await supabaseAdmin
    .from('customers')
    .upsert([{ id: uuid, stripe_customer_id: customerId }])

  if (upsertError)
    throw new Error(
      `Supabase customer record creation failed: ${upsertError.message}`
    )

  return customerId
}

const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email }
  const newCustomer = await stripe.customers.create(customerData)
  if (!newCustomer) throw new Error('Stripe customer creation failed.')

  return newCustomer.id
}

const createOrRetrieveCustomer = async ({
  email,
  uuid
}: {
  email: string
  uuid: string
}) => {
  // Check if the customer already exists in Supabase
  const { data: existingSupabaseCustomer, error: queryError } =
    await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('id', uuid)
      .maybeSingle()

  if (queryError) {
    throw new Error(`Supabase customer lookup failed: ${queryError.message}`)
  }

  // Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
  let stripeCustomerId: string | undefined
  if (existingSupabaseCustomer?.stripe_customer_id) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingSupabaseCustomer.stripe_customer_id
    )
    stripeCustomerId = existingStripeCustomer.id
  } else {
    // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
    const stripeCustomers = await stripe.customers.list({ email: email })
    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined
  }

  // If still no stripeCustomerId, create a new customer in Stripe
  const stripeIdToInsert = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe(uuid, email)
  if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.')

  if (existingSupabaseCustomer && stripeCustomerId) {
    // If Supabase has a record but doesn't match Stripe, update Supabase record
    if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
      const { error: updateError } = await supabaseAdmin
        .from('customers')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', uuid)

      if (updateError)
        throw new Error(
          `Supabase customer record update failed: ${updateError.message}`
        )
      console.warn(
        `Supabase customer record mismatched Stripe ID. Supabase record updated.`
      )
    }
    // If Supabase has a record and matches Stripe, return Stripe customer ID
    return stripeCustomerId
  } else {
    console.warn(
      `Supabase customer record was missing. A new record was created.`
    )

    // If Supabase has no record, create a new record and return Stripe customer ID
    const upsertedStripeCustomer = await upsertCustomerToSupabase(
      uuid,
      stripeIdToInsert
    )
    if (!upsertedStripeCustomer)
      throw new Error('Supabase customer record creation failed.')

    return upsertedStripeCustomer
  }
}

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string
  const { name, phone, address } = payment_method.billing_details
  // if (!name || !phone || !address) return;

  // No matter the state of billing information new subscription marks the user as not eligible for trials in future
  if (!name || !address) {
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        can_trial: false
      })
      .eq('id', uuid)

    if (updateError)
      throw new Error(`Customer update failed: ${updateError.message}`)
    return
  }
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address })
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
      can_trial: false
    })
    .eq('id', uuid)
  if (updateError)
    throw new Error(`Customer update failed: ${updateError.message}`)
}

const manageDiscordRoles = async (
  customerId: string,
  subscription: Stripe.Subscription
) => {
  const { data: connectionData, error: connectionError } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (connectionError) {
    console.error('Error fetching user_id:', connectionError)
  } else if (connectionData) {
    const userId = connectionData.id

    const { data: discordData, error: discordError } = await supabaseAdmin
      .from('discord_integration')
      .select('connection_status')
      .eq('user_id', userId)
      .single()

    if (discordError) {
      console.error('Error fetching connection_status:', discordError)
    } else {
      console.log('Connection Status:', discordData.connection_status)
    }
  }
}

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = true
) => {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (noCustomerError)
    throw new Error(`Customer lookup failed: ${noCustomerError.message}`)

  const { id: uuid } = customerData!

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method']
  })
  // Upsert the latest status of the subscription object.
  const subscriptionData: TablesInsert<'subscriptions'> = {
    id: subscription.id,
    user_id: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    //TODO check quantity on subscription
    // @ts-ignore
    quantity: subscription.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    current_period_start: toDateTime(
      subscription.current_period_start
    ).toISOString(),
    current_period_end: toDateTime(
      subscription.current_period_end
    ).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null
  }

  const { error: upsertError } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData])
  if (upsertError)
    throw new Error(`Subscription insert/update failed: ${upsertError.message}`)
  // const { data, error } = await supabase.auth.refreshSession()

  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]. `
  )
  // console.log(`Subscription [${subscription}]`);
  // console.log(
  //   `Default payment method`,
  //   JSON.stringify(subscription.default_payment_method, null, 2)
  // );
  // // console.log(`subscriptionData [${subscriptionData}]`);
  // console.log('subscriptionData', JSON.stringify(subscriptionData, null, 2));

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    // console.log('↓↓↓ Webhook fired ');

    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    )
}

// // Retrieve customer id
// const retrieveCustomerInStripe = async ({
//   email,
//   uuid
// }: {
//   email: string;
//   uuid: string;
// }) => {
//   const { data: existingSupabaseCustomer, error: queryError } =
//     await supabaseAdmin
//       .from('customers')
//       .select('*')
//       .eq('id', uuid)
//       .maybeSingle();

//   if (queryError) {
//     throw new Error(`Supabase customer lookup failed: ${queryError.message}`);
//   }
//   // Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
//   let stripeCustomerId: string | undefined;
//   if (existingSupabaseCustomer?.stripe_customer_id) {
//     const existingStripeCustomer = await stripe.customers.retrieve(
//       existingSupabaseCustomer.stripe_customer_id
//     );
//     stripeCustomerId = existingStripeCustomer.id;
//     // console.log('existingStripeCustomer', existingStripeCustomer);
//   } else {
//     // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
//     const stripeCustomers = await stripe.customers.list({ email: email });
//     stripeCustomerId =
//       stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
//   }
//   if (stripeCustomerId) {
//     return stripeCustomerId;
//   } else {
//     throw new Error('Supabase customer record couldnt be accessed.');
//   }
// };

export {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  manageDiscordRoles
  // retrieveCustomerInStripe
}
