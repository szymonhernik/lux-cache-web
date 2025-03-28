'use client'

import HCaptcha from '@hcaptcha/react-hcaptcha'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithPassword } from '@/utils/auth-helpers/server'
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { Button } from '@/components/shadcn/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/shadcn/ui/form'
import { Input } from '@/components/shadcn/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { signInSchema, SignInSchema } from '@/utils/types/zod/auth'
import { hCaptchaSiteKey } from '@/utils/auth-helpers/settings'

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
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | undefined>()
  const captcha = useRef<HCaptcha | null>(null)

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const handleLogin = async (values: SignInSchema) => {
    setIsSubmitting(true) // Disable the button while the request is being handled
    try {
      const redirectUrl: string = await signInWithPassword(values, captchaToken)
      captcha.current?.resetCaptcha()
      router.replace(redirectUrl)
      router.refresh()
    } catch (error) {
      // throw error
      console.error('Login failed', error)
      if (
        error instanceof Error &&
        error.message.includes('Strict rate limit exceeded')
      ) {
        toast('Too many login attempts. Please try again in a minute.')
      }
    }
    setIsSubmitting(false)
  }
  const handleVerify = (token: string) => {
    // Prevent any default navigation
    setCaptchaToken(token)
  }

  return (
    <div className="flex flex-col gap-8 ">
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
          <HCaptcha
            ref={captcha}
            sitekey={hCaptchaSiteKey}
            onVerify={handleVerify}
            onError={(err) => {
              console.error('hCaptcha Error:', err)
            }}
          />
          <Button type="submit" className=" w-fit " isLoading={isSubmitting}>
            Log in
          </Button>
        </form>
      </Form>
      <div className="">
        <p>
          <Link href={'/signin/signup '} className="text-sm">
            Don't have an account? Sign up
          </Link>
        </p>

        <p>
          <Link href={'/signin/forgot_password'} className="text-sm">
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  )
}
