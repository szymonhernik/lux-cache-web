'use client'

import Card from '@/components/ui/Card'
import { updateName } from '@/utils/auth-helpers/server'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/shadcn/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { nameUpdateSchema, NameUpdateSchema } from '@/utils/types/zod/auth'

export default function NameForm({
  userName,
  userId
}: {
  userName: string
  userId: string
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<NameUpdateSchema>({
    resolver: zodResolver(nameUpdateSchema),
    defaultValues: {
      fullName: userName
    }
  })

  const onSubmit = async (data: NameUpdateSchema) => {
    // Check if the new name is the same as the old name
    if (data.fullName === userName) {
      form.setError('fullName', {
        type: 'manual',
        message: 'New name must be different from current name'
      })
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('fullName', data.fullName)
      formData.append('userId', userId)
      const response = await updateName(formData)
      router.push(response)
    } catch (error) {
      console.error('Failed to update name:', error)
      form.setError('fullName', {
        type: 'manual',
        message: 'Failed to update name. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card
      title="Account Information"
      footer={
        <>
          <Button
            type="submit"
            form="nameForm"
            size="lg"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            loadingText="Updating"
          >
            Update
          </Button>
          <p className="">64 characters maximum</p>
        </>
      }
    >
      <div>
        <form
          id="nameForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-4 flex-col *:space-y-2 *:flex *:flex-col"
        >
          <div>
            <label htmlFor="fullName">Name</label>
            <input
              {...form.register('fullName')}
              type="text"
              className="w-full sm:w-3/4 p-3 rounded-sm border border-zinc-300 bg-transparent"
              placeholder="Your name"
              maxLength={64}
            />
            {form.formState.errors.fullName && (
              <p className="text-sm text-red-500">
                {form.formState.errors.fullName.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </Card>
  )
}
