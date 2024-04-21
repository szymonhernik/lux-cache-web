# lc app

## TODO

- [x] Make it deploy (vercel)

### Stripe

- [x] Add Custom Checkout with trial (w/stripe)
- [x] Handle Checkout page errros and actions during and after submitting the payment
- [x] TS for price.products.metadata?.index and .trial_allowed in server.tsx (validation w/zod)
- [x] if there is no default payment on subscription fetch backup default payment method set on a customer
- [x] Add form for setting a new Payment Method for subscribers
- [x] Add trial only on the lowest price
- [x] Add remove payment method
- [x] maintain at least one payment method for that subscription to charge. If they’d like to change their payment method, they’ll need to add a new one before deleting the existing one.
- [x] Add coupon codes
- [x] Checkout Summary
- [x] Handle change of plans and the quotes according to the current balance for the subscriber
- [ ] User can trial only once

  - [ ] add columns in users table: first_subscription_date (timestamptz), can_trial (boolean)
  - [ ] on checkout.session.completed stripe event update users table (as admin)

- [ ] check why there is three coupon@test.com customers in stripe dashboard (doesnt match the supabase data)
- [ ] Learn a bit more about stripe payment 3D Secure (3DS) authentication
- [ ] Optional: When removing or updating payment method disable other buttons
- [ ] Emails from stripe/supabase

- [ ] Make sure to check if you want to copy billing info and address to supabase users table
- [ ] Add CMS (w/ sanity)
- [ ] move the necessary queries to a queries file (use import 'server-only')
- [ ] Add authentication (w/ supabase)
- [ ] Set up database (w/ supabase)
- [ ] Set up Stripe (checkout, api points, webhooks)
- [ ] "taint" (server-only)
- [ ] Error management (w/ Sentry)
- [ ] Routing/image page (parallel route)
- [ ] Analytics (posthog)
- [ ] Ratelimiting (upstash)
- [ ] "infinite scroll"

### Future improvements

- [ ] Make sure a person doesn't open many accounts and subscribes to trials forever
