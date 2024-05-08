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

## Customer emails

- [ ] Emails from stripe
- [ ] Emails from supabase
- [ ] Connect Resend

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

### Not assigned yet

- [ ] create admin login with full access to page
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

## Stripe

- [ ] check why there is three coupon@test.com customers in stripe dashboard (doesnt match the supabase data)
- [ ] Learn a bit more about stripe payment 3D Secure (3DS) authentication
- [ ] Optional: When removing or updating payment method disable other buttons
- [ ] Optional: Find a way to add first_subscription_date (timestamptz) and don't update it ever again in users table
- [ ] Add paypal payment method and maybe local payment providers

## Research findings

### handle grid with lots of videos; advice from Rauno

- For each video file, I generate a base64 placeholder which I can use as a loading state
- Only render the videos that are visible on the screen
- As you scroll, this remains true—videos that go out of the viewport on scroll unmount their video tag. This was the only way to prevent Safari from choking.

---

### react-window library

The **InfiniteLoader** component was created to help break large data sets down into chunks that could be just-in-time loaded as they were scrolled into view. It can also be used to create infinite loading lists (e.g. Facebook or Twitter).
https://www.npmjs.com/package/react-window-infinite-loader
https://codesandbox.io/p/sandbox/x70ly749rq?
https://www.linkedin.com/pulse/optimize-app-performance-using-react-window-copycat-dev/

### react-intersection-observer

Possibly use for **Infinite Scroll**

- package: https://www.npmjs.com/package/react-intersection-observer
- Example to detect whether element is in view (multiple observers) https://react-intersection-observer.vercel.app/?path=/story/inview-component--multiple-observers
- how to implement infinite scroll: https://medium.com/@ryanmambou/how-to-implement-infinite-scroll-in-nextjs-without-button-99d8ce886985

---

### horizontal scrolling

- using Swiper library
  - working (grid, horizontal scrolling, draggable) example: https://codesandbox.io/p/devbox/swiper-react-mousewheel-control-forked-hd99tc?file=/src/App.jsx:26,24
    https://codesandbox.io/p/devbox/swiper-react-virtual-slides-forked-7mgnqq?file=/src/App.jsx:1,1-100,1
- using React
  - chatgpt solution: https://chat.openai.com/c/883529ad-006c-46d6-afc1-25b695661dbc (using useCallback, scrollLeft, counting e.deltaY)
- using framer motion ?

### tanstack virtual

https://tanstack.com/virtual/latest
Virtual, infinite scroll (i believe the height and width can be dynamic to viewport)
https://codesandbox.io/p/devbox/kind-pascal-xsjqzx?file=/src/main.tsx:96,23
https://stackblitz.com/edit/tanstack-virtual-8uf16a?file=src/main.tsx,src/index.css

- [ ] Update later to @tanstack/react-query (v5) from react-query (v3)
