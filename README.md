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
- [ ] Optional: When removing or updating payment method disable other buttons
- [x] Add coupon codes
- [ ] Checkout Summary
- [ ] Check that the user can trial only once
- [ ] Handle change of plans and the quotes according to the current balance for the subscriber

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
