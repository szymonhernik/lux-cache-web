'use client'

import React from 'react'
import Link from 'next/link'
import { signUp } from '@/utils/auth-helpers/server'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/shadcn/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/shadcn/ui/form'
import { Input } from '@/components/shadcn/ui/input'
import { toast } from 'sonner'
import { signUpSchema, SignUpSchema } from '@/utils/types/zod/auth'

// Define prop type with allowEmail boolean
interface SignUpProps {
  allowEmail: boolean
  redirectMethod: string
}

export default function SignUp({ allowEmail, redirectMethod }: SignUpProps) {
  const router = redirectMethod === 'client' ? useRouter() : null

  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: ''
    }
  })
  const handleSignup = async (values: {
    email: string
    password: string
    confirmPassword: string
  }) => {
    setIsSubmitting(true) // Disable the button while the request is being handled
    try {
      const redirectUrl: string = await signUp(values)
      if (router) {
        router.push(redirectUrl)
      }
    } catch (error) {
      console.error('Login failed', error)
      if (
        error instanceof Error &&
        error.message.includes('Strict rate limit exceeded')
      ) {
        toast('Too many signup attempts. Please try again in a minute.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 ">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSignup)}>
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
            Sign up
          </Button>
        </form>
      </Form>
      <div className="">
        <p>
          <Link href={'/signin/password_signin'} className="font-light text-sm">
            Already have an account? Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
