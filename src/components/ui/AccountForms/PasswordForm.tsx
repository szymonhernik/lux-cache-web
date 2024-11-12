'use client'

import { Button } from '@/components/shadcn/ui/button'
import Card from '@/components/ui/Card'
import { updatePasswordInAccountDashboard } from '@/utils/auth-helpers/server'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  passwordUpdateFormSchema,
  PasswordUpdateFormSchema
} from '@/utils/types/zod/auth'

export default function PasswordForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PasswordUpdateFormSchema>({
    resolver: zodResolver(passwordUpdateFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: PasswordUpdateFormSchema) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('password', data.password)
      formData.append('confirmPassword', data.confirmPassword)
      const response = await updatePasswordInAccountDashboard(formData)
      router.push(response)
    } catch (error) {
      console.error('Failed to update password:', error)
      form.setError('root', {
        type: 'manual',
        message: 'Failed to update password. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card
      title="Change password"
      footer={
        <>
          <Button
            type="submit"
            form="passwordUpdateForm"
            size="lg"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            loadingText="Updating"
          >
            Update
          </Button>
        </>
      }
    >
      <div>
        <form
          id="passwordUpdateForm"
          className="flex flex-col gap-4 *:space-y-2 *:flex *:flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <label htmlFor="password">New Password</label>
            <input
              {...form.register('password')}
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              className="w-full p-3 rounded-sm border border-zinc-300 bg-transparent"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              {...form.register('confirmPassword')}
              type="password"
              placeholder="Confirm password"
              autoComplete="new-password"
              className="w-full p-3 rounded-sm border border-zinc-300 bg-transparent"
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
          {form.formState.errors.root && (
            <p className="text-sm text-red-500">
              {form.formState.errors.root.message}
            </p>
          )}
        </form>
      </div>
    </Card>
  )
}
