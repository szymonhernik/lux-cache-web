'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { redirectToPath, signInWithPassword } from '@/utils/auth-helpers/server'
import { handleRequest } from '@/utils/auth-helpers/client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { revalidatePath } from 'next/cache'
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
import { Input } from '@/components/shadcn/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'

// Define prop type with allowEmail boolean
interface PasswordSignInProps {
  allowEmail: boolean
  redirectMethod: string
}

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Please enter your password.' })
})

export default function PasswordSignIn({
  allowEmail,
  redirectMethod
}: PasswordSignInProps) {
  const router = redirectMethod === 'client' ? useRouter() : null
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const handleLogin = async (values: { email: string; password: string }) => {
    setIsSubmitting(true) // Disable the button while the request is being handled
    try {
      const redirectUrl: string = await signInWithPassword(values)
      if (router) {
        router.replace(redirectUrl)
        router.refresh()
        // promise freeze for two seconds

        // window.location.reload()

        // redirectToPath(redirectUrl)
      }
      // return await redirectToPath(redirectUrl)
    } catch (error) {
      console.error('Login failed', error)
    }
    setIsSubmitting(false)
  }

  return (
    <div className="flex flex-col gap-8 my-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className=" space-y-4">
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
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Password</FormLabel>
                <FormControl>
                  <Input
                    className="py-4 "
                    placeholder="password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className=" w-fit " isLoading={isSubmitting}>
            Log in
          </Button>
        </form>
      </Form>

      <div className="">
        <p>
          <Link href="/signin/signup" className="text-sm">
            Don't have an account? Sign up
          </Link>
        </p>

        <p>
          <Link href="/signin/forgot_password" className="text-sm">
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  )
}
