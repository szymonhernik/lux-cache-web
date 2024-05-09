'use client'

import Card from '@/components/ui/Card'
import { updateName } from '@/utils/auth-helpers/server'
import { handleRequest } from '@/utils/auth-helpers/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'
import { Button } from '@/components/shadcn/ui/button'

const nameSchema = z
  .string()
  .min(1, "Name can't be empty")
  .max(64, "Name can't exceed 64 characters")

export default function NameForm({
  userName,
  userId
}: {
  userName: string
  userId: string
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentName, setCurrentName] = useState(userName)
  const [isInputDisabled, setIsInputDisabled] = useState(true)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setCurrentName(newName)
    // Validate the new name using Zod schema
    const validationResult = nameSchema.safeParse(newName)
    setIsInputDisabled(!validationResult.success || newName === userName)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true)
    // Check if the new name is the same as the old name
    if (e.currentTarget.fullName.value === userName) {
      e.preventDefault()
      setIsSubmitting(false)
      return
    }
    handleRequest(e, updateName, router)
    setIsSubmitting(false)
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
            isLoading={isSubmitting}
            loadingText="Updating"
          >
            Update
          </Button>
          <p className="">64 characters maximum</p>
        </>
      }
    >
      <div className=" ">
        <form
          id="nameForm"
          onSubmit={(e) => handleSubmit(e)}
          className="flex gap-4 flex-col *:space-y-2 *:flex *:flex-col"
        >
          <div>
            <label htmlFor="fullName">Name</label>
            <input type="hidden" name="userId" value={userId} />
            <input
              id="fullName"
              type="text"
              name="fullName"
              className="w-full sm:w-3/4 p-3 rounded-sm border border-zinc-300 bg-transparent"
              defaultValue={userName}
              onChange={handleInputChange}
              placeholder="Your name"
              maxLength={64}
            />
          </div>
        </form>
      </div>
    </Card>
  )
}
