# LC App - Content Platform with Subscription System

A content platform built with Next.js 14, featuring subscription-based access to premium content. The platform integrates multiple services.

## Core Technologies

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**:
  - Supabase (Authentication, Database)
  - Stripe (Payment Processing)
  - Sanity CMS (Content Management)
  - Discord Integration (Community Features)
- **Infrastructure**:
  - Vercel (Hosting)
  - BunnyCDN (Media Delivery)
  - Resend (Email Service)
  - Sentry (Error Tracking)
  - Upstash (Rate Limiting)

## Key Features

- Tiered subscription system with trial periods
- Content management with dynamic search and filtering
- OAuth authentication (Google, Discord)
- Responsive design with grid/list view options
- Infinite scroll implementation
- Discord role management based on subscription status
- Automated email notifications
- Real-time subscription management

## Development

Based on the [Next.js Subscription Payments Template](https://github.com/vercel/nextjs-subscription-payments), extensively customized and enhanced with additional features and integrations.

<!-- TODO -->

<!-- early access -->

[x] if the user confirms the email via early-access sign up flow, they will be sent to early-access/success route, rather than signin route.
[x] when user signs up make sure the is_early_access in tables are checked as TRUE (right now it's not happening)
[x] make sure the user gets confirmation to their email with info what to expect (that they will get info etc etc, they will be able to checkout once the app goes life with the discount when they signin with the same email)
[x] what happens if the verification email expires/email provider pre-opens it, thus invalidating it? Is their account already verified and they can log in and they get an email anyway so you don't have to worry?
[x] add option for users to resend the verification email.
[x] update the database with early access flag

[x] add option for users to resend the verification email -> it's enough to sign up again to the same email and you will receive a new confirmation email.

[ ] research how to send email to all your users (for example in case you need to communicate something), it's not newsletter
[x] TODO: check if the redirects work correctly for oauth and for email signup.
NOT NEEDED:
how to make sure only subscribers can get on early-access signup deal?

<!--  -->

# Development branch

[ ] Create a dedicated “Trial plan” price at €0

- You make a hidden Stripe price with unit_amount: 0.
- Give it a trial_period_days: 14.
- Auto-cancel at trial end via webhook.
- After 14 days, subscription is canceled, and you prompt them to pick one of the real paid tiers.
