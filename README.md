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
- [x] User can trial only once

  - [x] add columns in users table: , can_trial (boolean)
  - [x] on checkout.session.completed stripe event update users table (as admin)
  - [x] when creating checkout session, don't pass trial option if can_trial is false (read from users table)

- [ ] don't show premium plans panel in account for users without a current subscription
- [ ] see why you are getting three trial end and three customers get added when subscribing to stripe

### Customer emails

- [x] Sample email from stripe on subscription confirmed webhook
- [x] Supabase Auth email templates test styling for Magic Link
- [x] Connect Resend
- [x] Send email for a new signed up and deleted users (w/ Resend and Supabase Edge Functions)
  - [x] create a test supabase edge function
  - [x] set up supabase webhook listening to insert and delete events for users table
    - useful link from supabase https://www.youtube.com/watch?v=Qf7XvL1fjvo&t=357s

### Front-end

- [x] Reset styles
- [ ] Horizontal scrolling browse page
- [x] Design switching between list and grid view on mobile
- [x] grid that works in Arc doesnt work anywhere else. make rows by hand depending on the height viewport.
- [ ] add color variables
- [x] mobile menu: not closing after clicking on the link
- [x] Search dialog with sample data fetch (server side-reading searchParams)
- [x] clean up the code
- [ ] Create pages for search results
- [x] Create pages for artists.
- [x] "infinite scroll" (w/ tanstack infinite scroll lib)
- [x] routes - tabs
- [ ] Routing/post page (parallel route)
- [ ] TODO: Role based access (front end)

### Supabase

- [x] Set up database (w/ supabase)
- [ ] add Google and Discord providers
  - [x] google
  - [x] discord
- [ ] adding bookmarks (after setting up CMS)
- [x] user_roles — try custom jwt token (assign user_roles for admins and editors)
- [x] Learn managing migrations between local and remote instance of db (good example of syncing in both direction https://www.youtube.com/watch?v=2SXK0TOsdNY&t=1733s)
- [x] set custom jwt token again and
- [x] add resend function in webhooks
- [ ] fetch subscription data in routes (not JWT)

### Sanity CMS

- [x] configure Sanity
- [x] sketch out structure
- [x] test fetching
- [x] sanity generate type interfaces (w/ sanity typegen)
- [x] substitute types with generated interfaces
- [ ] meeting with Kai about the structure (https://excalidraw.com/)
- [ ] CMS structure
- [ ] TODO: Set up sanity schemas (sanity)
- [ ] TODO: Custom blocks for post contents

TODAY:

### Not assigned yet

- [ ] Check how bandwidth is counted with exporting pdfs
- [ ] create admin login with full access to page
- [ ] fix reset password supabase email template (use the one written in the previous lc project)
- [ ] Make sure to check if you want to copy billing info and address to supabase users table
- [ ] move the necessary queries to a queries file (use import 'server-only')
- [x] Add authentication (w/ supabase)

- [ ] Set up Stripe (checkout, api points, webhooks)
- [ ] clean up billing info zod file (too much nesting and error scenarios)
- [ ] "taint" (server-only)
- [ ] Error management (w/ Sentry)
- [ ] Analytics (posthog)
- [ ] Ratelimiting (upstash)

### Before going into production

- [ ] style welcome emails and goodbye emails
- [ ] Configure resend with Lux Cache email
- [ ] cookies info and how it works

#### Future improvements

- [ ] Make sure a person doesn't open many accounts and subscribes to trials forever

### Stripe

- [ ] check why there is three coupon@test.com customers in stripe dashboard (doesnt match the supabase data)
- [ ] Learn a bit more about stripe payment 3D Secure (3DS) authentication
- [ ] Optional: When removing or updating payment method disable other buttons
- [ ] Optional: Find a way to add first_subscription_date (timestamptz) and don't update it ever again in users table
- [ ] Add paypal payment method and maybe local payment providers

## Required from Kai

- [ ] Information for welcome and goodbye emails, and other needed

---

follow this tutorial:
https://www.ericburel.tech/blog/static-paid-content-app-router

i think on page.tsx route level instead of calling db you can retrieve subscription trier from session, set in custom JWT token (https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac) then in page.tsx you check it against info about post from CMS and render content or redirect.
