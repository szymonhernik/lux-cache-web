'use client'

import { Button } from '@/components/shadcn/ui/button'
import Card from '@/components/ui/Card'
import { handleRequest } from '@/utils/auth-helpers/client'
import { updatePasswordInAccount } from '@/utils/auth-helpers/server'
import { useRouter } from 'next/navigation'
import { useState } from 'react'


export default function PasswordForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true) // Disable the button while the request is being handled
    await handleRequest(e, updatePasswordInAccount, router)

    setIsSubmitting(false)
  }

  return (
    <Card
      title="Change password"
      footer={
        <>
          {' '}
          <Button
            type="submit"
            form="passwordUpdateForm"
            size="lg"
            isLoading={isSubmitting}
            loadingText="Updating"
          >
            Update
          </Button>
        </>
      }
    >
      <div className="">
        <form
          noValidate={true}
          id="passwordUpdateForm"
          className="flex flex-col gap-4 *:space-y-2 *:flex *:flex-col"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div>
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              className="w-full p-3 rounded-sm border border-zinc-300 bg-transparent"
            />
          </div>
          <div>
            <label htmlFor="passwordConfirm">Confirm New Password</label>
            <input
              id="passwordConfirm"
              placeholder="Password"
              type="password"
              name="passwordConfirm"
              autoComplete="current-password"
              className="w-full p-3 rounded-sm border border-zinc-300 bg-transparent"
            />
          </div>
        </form>
      </div>
    </Card>
  )
}
