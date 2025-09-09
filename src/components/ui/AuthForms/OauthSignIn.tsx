'use client'

import { signInWithOAuth } from '@/utils/auth-helpers/client'
import { type Provider } from '@supabase/supabase-js'
// import { Github } from 'lucide-react';
import { FaDiscord, FaGoogle } from 'react-icons/fa'
// import { Google } from 'react-ionicons';
import { useState } from 'react'
import { Button } from '@/components/shadcn/ui/button'

type OAuthProviders = {
  name: Provider
  displayName: string
  icon: JSX.Element
}

export default function OauthSignIn({ disabled }: { disabled?: boolean }) {
  const oAuthProviders: OAuthProviders[] = [
    // {
    //   name: 'github',
    //   displayName: 'GitHub',
    //   icon: <FaGithub className="h-5 w-5" />
    // },
    {
      name: 'discord',
      displayName: 'Discord',
      icon: <FaDiscord className="h-5 w-5" />
    },
    {
      name: 'google',
      displayName: 'Google',
      icon: <FaGoogle className="h-5 w-5" />
    }

    /* Add desired OAuth providers here */
  ]
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true) // Disable the button while the request is being handled
    await signInWithOAuth(e)
    setIsSubmitting(false)
  }

  return (
    <div className="mt-4 flex flex-col gap-2">
      {oAuthProviders.map((provider) => (
        <form
          key={provider.name}
          className="grow"
          onSubmit={(e) => handleSubmit(e)}
        >
          <input type="hidden" name="provider" value={provider.name} />
          <Button
            variant={'outline'}
            size={'lg'}
            type="submit"
            className={`w-full font-normal ${
              provider.name === 'discord'
                ? 'bg-[#5865F2] text-white hover:text-white hover:bg-[#4752C4] border-0'
                : ''
            }`}
            isLoading={isSubmitting}
            disabled={disabled}
          >
            <span className="mr-2">{provider.icon}</span>
            <span>{provider.displayName}</span>
          </Button>
        </form>
      ))}
    </div>
  )
}
