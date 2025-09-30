// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// / <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

type UserRecord = Database['auth']['Tables']['users']['Row']

// @ts-ignore
import { Database } from './types.ts'

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: UserRecord
  schema: 'auth'
  old_record: null | UserRecord
}

// @ts-ignore
Deno.serve(async (req) => {
  try {
    const payload: WebhookPayload = await req.json()
    const newUser = payload.record
    const deletedUser = payload.old_record

    // console.log('Webhook payload received:', {
    //   type: payload.type,
    //   table: payload.table,
    //   userEmail: newUser?.email || deletedUser?.email
    // })

    // Only send email for INSERT operations (new user registration)
    if (payload.type === 'INSERT' && newUser?.email) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // @ts-ignore
          Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`
        },
        body: JSON.stringify({
          from: 'Lux Cache <no-reply@luxcache.com>',
          to: [newUser.email],
          subject: 'Welcome to Lux Cache!',
          html: `
           
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #333;">Welcome to Lux Cache!</h1>
              <p>Dear, ${newUser.email}</p>
              <p>We are delighted to welcome you to Lux Cache, a platform dedicated to providing innovative tools, insights, and support in music production.</p>
              <p>At Lux Cache, we collaborate with pioneering artists and producers to offer an unparalleled array of resources. Our commissioned articles, presentations, sample packs, features, and tutorials are designed to foster creativity and enhance your musical journey.</p>
              <p>We invite you to start exploring our platform and begin participating in our vibrant Discord community. Visit LUXCACHE.COM to start exploring our resources and connect with like-minded innovators on our Discord server.</p>
              <p>Best regards,</p>
              <p>Lux Cache Staff</p>
              <footer >
              <p>Want to pitch us a guest or collaboration? → Email or DM us</p>
              <p>This email was sent to ${newUser.email}</p>
              </footer>
              
            </div>
          `
        })
      })

      const data = await res.json()
      // console.log('Resend API response:', data)

      if (!res.ok) {
        console.error('Failed to send email:', data)
        return new Response(JSON.stringify({ error: 'Failed to send email' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Welcome email sent successfully',
          userEmail: newUser.email
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    } else {
      // console.log('Skipping email send - not a new user registration')
      return new Response(
        JSON.stringify({
          message: 'Webhook received but no action taken'
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  } catch (error) {
    // console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Get your anon key from the Supabase dashboard or run: `supabase status`
  3. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/user-welcome-email' \
    --header 'Authorization: Bearer YOUR_ANON_KEY_HERE' \
    --header 'Content-Type: application/json' \
    --data '{"type":"INSERT","table":"users","schema":"auth","record":{"id":"test-user-id","email":"test@example.com","created_at":"2024-01-01T00:00:00Z"}}'

*/
