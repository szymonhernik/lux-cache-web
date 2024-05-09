'use client'

import Card from '@/components/ui/Card'
import { updateEmail } from '@/utils/auth-helpers/server'
import { handleRequest } from '@/utils/auth-helpers/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/shadcn/ui/button'

export default function EmailForm({
  userEmail
}: {
  userEmail: string | undefined
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true)
    // Check if the new email is the same as the old email
    if (e.currentTarget.newEmail.value === userEmail) {
      e.preventDefault()
      setIsSubmitting(false)
      return
    }
    handleRequest(e, updateEmail, router)
    setIsSubmitting(false)
  }

  return (
    <Card
      title="Contact Information"
      footer={
        <div className="flex flex-col items-start justify-between gap-2 ">
          <Button
            type="submit"
            form="emailForm"
            size="lg"
            isLoading={isSubmitting}
            loadingText="Updating"
          >
            Update
          </Button>
          <p className="pb-4 sm:pb-0">
            We will email you to verify the change.
          </p>
        </div>
      }
    >
      <div className="">
        <form
          id="emailForm"
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col gap-4 *:space-y-2 *:flex *:flex-col"
        >
          <div>
            <label htmlFor="newEmail">Email address *</label>
            <input
              type="text"
              name="newEmail"
              className="w-full p-3 rounded-sm border border-zinc-300 bg-transparent"
              defaultValue={userEmail ?? ''}
              placeholder="Your email"
              maxLength={64}
            />
          </div>
        </form>
      </div>
    </Card>
  )
}
