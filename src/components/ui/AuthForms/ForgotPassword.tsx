'use client'

import Link from 'next/link'
import { requestPasswordUpdate } from '@/utils/auth-helpers/server'
import { handleRequest } from '@/utils/auth-helpers/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/shadcn/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/shadcn/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/shadcn/ui/input'

// Define prop type with allowEmail boolean
interface ForgotPasswordProps {
  allowEmail: boolean
  redirectMethod: string
  disableButton?: boolean
}
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' })
})

export default function ForgotPassword({
  allowEmail,
  redirectMethod,
  disableButton
}: ForgotPasswordProps) {
  const router = redirectMethod === 'client' ? useRouter() : null
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  })

  const handleReset = async (values: { email: string }) => {
    setIsSubmitting(true) // Disable the button while the request is being handled
    try {
      const redirectUrl: string = await requestPasswordUpdate(values)
      window.location.replace(redirectUrl)
      // if (router) {
      //   router.push(redirectUrl)
      //   router.refresh()
      // }
    } catch (error) {
      console.error('Login failed', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 my-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleReset)} className=" space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Email</FormLabel>
                <FormControl>
                  <Input
                    className="py-4 "
                    placeholder="user@example.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  We will send you an email to this address with a link to reset
                  your password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-fit"
            isLoading={isSubmitting}
            disabled={disableButton}
          >
            Send Email
          </Button>
        </form>
      </Form>
      <div>
        <p>
          <Link href="/signin/password_signin" className="text-sm">
            Sign in with email and password
          </Link>
        </p>
        <p>
          <Link href="/signin/signup" className="text-sm">
            Don't have an account? Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
