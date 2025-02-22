'use client'

import { updatePassword } from '@/utils/auth-helpers/server'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Button } from '@/components/shadcn/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/shadcn/ui/form'
import { Input } from '@/components/shadcn/ui/input'
import {
  passwordUpdateFormSchema,
  PasswordUpdateFormSchema,
  PasswordUpdateSchema
} from '@/utils/types/zod/auth'

interface UpdatePasswordProps {
  redirectMethod: string
}

export default function UpdatePassword({
  redirectMethod
}: UpdatePasswordProps) {
  const router = redirectMethod === 'client' ? useRouter() : null
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PasswordUpdateFormSchema>({
    resolver: zodResolver(passwordUpdateFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const handleUpdate = async (values: PasswordUpdateSchema) => {
    setIsSubmitting(true) // Disable the button while the request is being handled
    try {
      const redirectUrl: string = await updatePassword(values)
      if (router) {
        router.push(redirectUrl)
      }
    } catch (error) {
      console.error('Password update failed', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdate)} className=" space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Password</FormLabel>
                <FormControl>
                  <Input
                    className="py-4 "
                    placeholder="Password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    className="py-4 "
                    placeholder="Confirm Password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className=" w-fit " isLoading={isSubmitting}>
            Confirm
          </Button>
        </form>
      </Form>
    </div>
  )
}
