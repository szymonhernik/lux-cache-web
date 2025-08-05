// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// / <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

type UserRecord = Database['auth']['Tables']['users']['Row']

console.log('Hello from `user-welcome-email` function!')

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

    console.log('Webhook payload received:', {
      type: payload.type,
      table: payload.table,
      userEmail: newUser?.email || deletedUser?.email
    })

    // Only send email for INSERT operations (new user registration)
    if (payload.type === 'INSERT' && newUser?.email) {
      console.log('Sending welcome email to:', newUser.email)

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // @ts-ignore
          Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`
        },
        body: JSON.stringify({
          from: 'Lux Cache <hello@szymonhernik.com>',
          to: [newUser.email],
          subject: 'Welcome to Lux Cache! 🎉',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #333;">Welcome to Lux Cache!</h1>
              <p>Hey ${newUser.email},</p>
              <p>Thank you for joining Lux Cache! We're excited to have you on board.</p>
              <p>You can now start exploring our platform and discovering amazing content.</p>
              <p>Best regards,<br>The Lux Cache Team</p>
            </div>
          `
        })
      })

      const data = await res.json()
      console.log('Resend API response:', data)

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
      console.log('Skipping email send - not a new user registration')
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
    console.error('Error processing webhook:', error)
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
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/user-welcome-email' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"type":"INSERT","table":"users","schema":"auth","record":{"id":"test-user-id","email":"test@example.com","created_at":"2024-01-01T00:00:00Z"}}'

*/
