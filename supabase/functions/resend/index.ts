// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

type UserRecord = Database['auth']['Tables']['users']['Row']
console.log('Hello from `database-webhook` function!')
import { Database } from './types.ts'
interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: UserRecord
  schema: 'auth'
  old_record: null | UserRecord
}

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json()
  const newUser = payload.record
  const deletedUser = payload.old_record

  // console.log(payload.record.email)
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`
    },
    body: JSON.stringify({
      from: 'Lux Cache <hello@szymonhernik.com>',
      to: [newUser?.email || deletedUser?.email],
      subject: deletedUser ? 'Account deleted' : 'Welcome to Lux Cache!',
      html: deletedUser
        ? `Hey ${deletedUser.email}, sad to see you go.`
        : `Hey ${newUser.email}, welcome to Lux Cache!`
    })
  })

  const data = await res.json()
  console.log({ data })

  return new Response('ok')
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/database-webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
