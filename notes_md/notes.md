# lc app

Template repo: https://github.com/vercel/nextjs-subscription-payments

## TODO

- [x] Make it deploy (vercel)
- [x] Update with changes made to template repo

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
- [x] make sure someone can't open two checkouts and subscribe to two plans (maybe in stripe disable mutliple subscription)

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
- [x] Horizontal scrolling browse page
- [x] Design switching between list and grid view on mobile
- [x] grid that works in Arc doesnt work anywhere else. make rows by hand depending on the height viewport.
- [x] add color variables
- [x] mobile menu: not closing after clicking on the link
- [x] Search dialog with sample data fetch (server side-reading searchParams)
- [x] clean up the code
- [x] Create pages for search results
- [x] Create pages for artists.
- [x] "infinite scroll" (w/ tanstack infinite scroll lib)
- [x] routes - tabs
- [x] Query page browse (infinite scroll)
- [x] Clean the draft mode and typescript
- [x] Routing/post page (parallel route)
- [x] List view
- [x] Read user's tier access (front end)
- [x] See what can be put in middleware and what on pages routes (authorization: https://www.youtube.com/watch?v=kbCzZzXTjuw)
- [x] Fetch function for initial posts — render static browse, all posts filtered should be dynamic (api route)
- [x] filters results
- [x] dynamic search results (also in studio)
- [x] see if you need modal, if it's not better to have useState or simple dialog for preview of posts. then you can have redirect from post page, with search params added to view the dialog
- [x] render default two results for each search query so that it's not empty
- [x] Image in post modal
- [x] Results pages
- [x] Modal post link
- [x] Style article
- [ ] Style pages
- [x] User login flow
- [x] breadcrumbs (w/shadcn)
- [x] after login the browse page doesnt get updated subscription data.
- [x] toaster is below dialog
- [x] when you click login and the password is good and then try to close the modal is not closing but going back to the same modal and then you need to click again and only then it closes (switch from router.push to router.replace)

### Supabase

- [x] Set up database (w/ supabase)
- [x] add Google and Discord providers
  - [x] google
  - [x] discord
- [x] adding bookmarks (after setting up CMS)
- [x] user_roles — try custom jwt token (assign user_roles for admins and editors)
- [x] Learn managing migrations between local and remote instance of db (good example of syncing in both direction https://www.youtube.com/watch?v=2SXK0TOsdNY&t=1733s)
- [x] set custom jwt token again and
- [x] add resend function in webhooks
- [x] fetch subscription data in routes (not JWT)

### Sanity CMS

- [x] configure Sanity
- [x] sketch out structure
- [x] test fetching
- [x] sanity generate type interfaces (w/ sanity typegen)
- [x] substitute types with generated interfaces
- [x] meeting with Kai about the structure (https://excalidraw.com/)
- [x] CMS structure
- [x] Set up sanity schemas (sanity)
- [x] Custom blocks for post contents
- [x] typescript for sanity
- [x] set up queries
- [x] dynamic search queries

TODAY:

### Not assigned yet

- [ ] Check how bandwidth is counted with exporting pdfs
- [ ] create admin login with full access to page
- [ ] fix reset password supabase email template (use the one written in the previous lc project)
- [ ] Make sure to check if you want to copy billing info and address to supabase users table (NO!)
- [x] move the necessary queries to a queries file (use import 'server-only')
- [x] Add authentication (w/ supabase)
- [x] videos via bunny cdn
- [x] Set up Stripe (checkout, api points, webhooks)
- [ ] clean up billing info zod file (too much nesting and error scenarios)
- [ ] "taint" (server-only)
- [x] Error management (w/ Sentry) https://www.youtube.com/watch?v=FmezY-vYlkg
- [x] Feedback button (w/ Sentry https://www.youtube.com/watch?v=8CdKgnErqQM)
- [ ] Analytics (posthog)
- [x] Ratelimiting (upstash)

### Before going into production

- [ ] style welcome emails and goodbye emails
- [ ] Configure resend with Lux Cache email
- [ ] cookies info and how it works
- [ ] Mux billing and card details
- [x] run videos and audio through bunny cdn
- [ ] https://www.youtube.com/watch?v=nSOmL2DxzbU (using posthog)

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

command to generate types (sanity)
sanity schema extract  
sanity typegen generate  
mv schema.json sanity.types.ts src/utils/types/sanity/

https://www.radix-ui.com/icons

LC DRIVE: https://drive.google.com/drive/folders/1kj9jbNEVUXGrVBxxjjfxDBZ_7C-3HElE

---

### **Step-by-Step Process for Updated Discord Integration:**

1. **Stripe Webhook Event Handling (`/api/webhooks/route.ts`)**:

   - When a subscription is created, updated, or deleted, Stripe sends a webhook event.
   - The event triggers the `manageSubscriptionStatusChange()` function to update the subscription status.
   - **If a subscription is created or updated**, the system checks the user's Discord integration and manages roles accordingly by calling `manageDiscordRoles()`.
   - **If a subscription is deleted**, the system calls `removeDiscordRoles()` to revoke all of the user’s Discord roles.

2. **Fetching Customer and Discord Integration Data (`manageDiscordRoles()` in `utils/supabase/admin.ts`)**:

   - The function retrieves the customer’s ID using the `customers` table in Supabase based on the Stripe customer ID.
   - It fetches the Discord connection status and Discord ID from the `discord_integration` table.
   - If the user is connected to Discord, the system retrieves their subscription plan and assigns the appropriate Discord roles.

3. **Assigning Discord Roles (`assignDiscordRoles()` in `discord/actions.ts`)**:

   - The `assignDiscordRoles()` function assigns roles based on the user's subscription plan. It compares the current roles with the required ones and makes updates using the Discord API.
   - Roles that are no longer relevant are removed, and the correct role for the current subscription tier is assigned.

4. **Handling Subscription Deletion (New Functionality)**:

   - When a subscription is deleted, the system calls the `removeDiscordRoles()` function.
   - This function fetches the current roles for the user from the Discord server and removes all subscription-related roles using the Discord API.

5. **Removing Discord Roles (`removeAllDiscordRoles()` in `discord/actions.ts`)**:

   - This function removes all roles associated with subscription tiers (Supporter, Subscriber, Premium) by fetching the user’s current roles from Discord and issuing DELETE requests for each role using the Discord API.

6. **Updating Discord Integration Status**:
   - If a user disconnects their Discord account or their subscription is deleted, the Discord integration status is updated in the `discord_integration` table.
   - This reflects the disconnection or revocation of roles, ensuring that the user no longer has roles in Discord.

---

### **Updated Diagram**:

```
Stripe Webhook (Subscription Created/Updated/Deleted)
            |
            v
  manageSubscriptionStatusChange()
            |
            v
   ┌────────┴─────────┐
   |                  |
Updated Subscription  Deleted Subscription
   |                  |
   v                  v
manageDiscordRoles()  removeDiscordRoles()
   |                  |
   v                  |
 Fetch User Info      |
   |                  |
   v                  |
Fetch Discord Connection Info
   |                  |
   v                  |
Retrieve Subscription Plan (Stripe)
   |                  |
   v                  |
 assignDiscordRoles()  |
   |                  |
   v                  v
Remove Old Roles    removeAllDiscordRoles()
   |                  |
   v                  v
 Add New Role    Remove All Roles
   |
   v
Role Assignment Completed
```
