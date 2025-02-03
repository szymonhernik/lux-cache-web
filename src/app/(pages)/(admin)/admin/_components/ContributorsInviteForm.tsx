'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Card from '@/components/ui/Card'
import { Button } from '@/components/shadcn/ui/button'
import { inviteContributor } from '@/utils/auth-helpers/server'
import { useRouter } from 'next/navigation'

// Define the schema for the invite form
const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address')
})

type InviteSchema = z.infer<typeof inviteSchema>

export default function ContributorsInviteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<InviteSchema>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (data: InviteSchema) => {
    setIsSubmitting(true)
    try {
      // For now, just log the email - you'll replace this with your Supabase logic later
      console.log('Inviting contributor:', data.email)
      // TODO: Add Supabase user_roles logic here
      const formData = new FormData()
      formData.append('email', data.email)
      const response = await inviteContributor(formData)
      router.push(response)
    } catch (error) {
      console.error('Failed to invite contributor:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card
      title="Invite Contributor"
      footer={
        <Button
          type="submit"
          form="inviteForm"
          size="lg"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          loadingText="Inviting"
        >
          Send Invite
        </Button>
      }
    >
      <div>
        <form
          id="inviteForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 *:space-y-2 *:flex *:flex-col"
        >
          <div>
            <label htmlFor="email">Email address *</label>
            <input
              {...form.register('email')}
              type="email"
              className="w-full p-3 rounded-sm border border-zinc-300 bg-transparent"
              placeholder="Contributor's email"
              maxLength={64}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </Card>
  )
}
