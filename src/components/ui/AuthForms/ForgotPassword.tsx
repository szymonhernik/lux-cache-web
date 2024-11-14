'use client'

import Link from 'next/link'
import { requestPasswordUpdate } from '@/utils/auth-helpers/server'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
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
import {
  passwordResetSchema,
  PasswordResetSchema
} from '@/utils/types/zod/auth'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { hCaptchaSiteKey } from '@/utils/auth-helpers/settings'

// Define prop type with allowEmail boolean
interface ForgotPasswordProps {
  allowEmail: boolean
  redirectMethod: string
  disableButton?: boolean
}

export default function ForgotPassword({
  allowEmail,
  redirectMethod,
  disableButton
}: ForgotPasswordProps) {
  const router = redirectMethod === 'client' ? useRouter() : null
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | undefined>()
  const captcha = useRef<HCaptcha | null>(null)

  const form = useForm<PasswordResetSchema>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: ''
    }
  })

  const handleVerify = (token: string) => {
    setCaptchaToken(token)
  }

  const handleReset = async (values: PasswordResetSchema) => {
    setIsSubmitting(true) // Disable the button while the request is being handled
    try {
      const redirectUrl: string = await requestPasswordUpdate(
        values,
        captchaToken
      )
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
    <div className="flex flex-col gap-8 ">
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
          <HCaptcha
            ref={captcha}
            sitekey={hCaptchaSiteKey}
            onVerify={handleVerify}
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
          <Link href={'/signin/password_signin'} className="text-sm">
            Sign in with email and password
          </Link>
        </p>
        <p>
          <Link href={'/signin/signup'} className="text-sm">
            Don't have an account? Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
