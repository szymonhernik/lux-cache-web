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

// Define prop type with allowEmail boolean
interface SignUpProps {
  allowEmail: boolean
  redirectMethod: string
}

const formSchema = z
  .object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z
      .string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, and one digit'
      }),
    confirmPassword: z.string()
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword
    },
    {
      message: 'Passwords must match',
      path: ['confirmPassword']
    }
  )

export default function SignUp({ allowEmail, redirectMethod }: SignUpProps) {
  const router = redirectMethod === 'client' ? useRouter() : null
  const [isSubmitting, setIsSubmitting] = useState(false)

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   setIsSubmitting(true) // Disable the button while the request is being handled
  //   await handleRequest(e, signUp, router)
  //   setIsSubmitting(false)
  // }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 my-8">
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
          <Link href="/signin/password_signin" className="font-light text-sm">
            Already have an account? Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
