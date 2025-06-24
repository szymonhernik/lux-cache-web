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

[] if the user confirms the email via early-access sign up flow, they will be sent to early-access/success route, rather than signin route.
[] make sure the user gets confirmation to their email with info what to expect (that they will get info etc etc, they will be able to checkout once the app goes life with the discount when they signin with the same email)
[] what happens if the verification email expires/email provider pre-opens it, thus invalidating it? Is their account already verified and they can log in and they get an email anyway so you don't have to worry?
[] update the database with early access flag

NOT NEEDED:
how to make sure only subscribers can get on early-access signup deal?

<!--  -->
