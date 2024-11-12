'use client'

import Card from '@/components/ui/Card'
import { updateEmail } from '@/utils/auth-helpers/server'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/shadcn/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { emailUpdateSchema, EmailUpdateSchema } from '@/utils/types/zod/auth'

export default function EmailForm({
  userEmail
}: {
  userEmail: string | undefined
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<EmailUpdateSchema>({
    resolver: zodResolver(emailUpdateSchema),
    defaultValues: {
      newEmail: userEmail ?? ''
    }
  })

  const onSubmit = async (data: EmailUpdateSchema) => {
    // Check if the new email is the same as the old email
    if (data.newEmail === userEmail) {
      form.setError('newEmail', {
        type: 'manual',
        message: 'New email must be different from current email'
      })
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('newEmail', data.newEmail)
      const response = await updateEmail(formData)
      router.push(response)
    } catch (error) {
      console.error('Failed to update email:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card
      title="Contact Information"
      footer={
        <>
          <Button
            type="submit"
            form="emailForm"
            size="lg"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            loadingText="Updating"
          >
            Update
          </Button>
          <p className="pb-4 sm:pb-0">
            We will email you to verify the change.
          </p>
        </>
      }
    >
      <div>
        <form
          id="emailForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 *:space-y-2 *:flex *:flex-col"
        >
          <div>
            <label htmlFor="newEmail">Email address *</label>
            <input
              {...form.register('newEmail')}
              type="email"
              className="w-full p-3 rounded-sm border border-zinc-300 bg-transparent"
              placeholder="Your email"
              maxLength={64}
            />
            {form.formState.errors.newEmail && (
              <p className="text-sm text-red-500">
                {form.formState.errors.newEmail.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </Card>
  )
}
