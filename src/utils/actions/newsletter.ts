'use server'

import Mailjet from 'node-mailjet'
import { z } from 'zod'
import { checkRateLimit } from '@/utils/upstash/helpers'
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers'

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().optional()
})

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY!,
  process.env.MAILJET_API_SECRET!
)

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email')?.toString()
  const name = formData.get('name')?.toString()

  const result = newsletterSchema.safeParse({ email, name })
  if (!result.success) {
    return getErrorRedirect(
      '/newsletter',
      'Invalid input',
      result.error.errors[0].message
    )
  }

  await checkRateLimit('newsletter:subscribe')

  try {
    // Add contact directly to list using managecontact endpoint
    const response = await mailjet
      .post('contactslist', { version: 'v3' })
      .id(10489307)
      .action('managecontact')
      .request({
        Email: email,
        Name: name || '',
        Action: 'addforce'
      })

    if (response.response.status === 201) {
      return getStatusRedirect(
        '/newsletter',
        'Success!',
        'You have been subscribed to the newsletter.'
      )
    }

    return getErrorRedirect(
      '/newsletter',
      'Subscription failed',
      'Unable to subscribe to newsletter'
    )
  } catch (error: any) {
    console.error('Newsletter subscription error:', error)
    return getErrorRedirect(
      '/newsletter',
      'Subscription failed',
      'An error occurred while subscribing'
    )
  }
}
