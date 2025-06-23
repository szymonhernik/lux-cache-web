'use client'
import EarlyAccessSignup from '@/components/ui/AuthForms/EarlyAccessSignup'
import SignUp from '@/components/ui/AuthForms/Signup'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function EmailSignUp({}: {}) {
  const searchParams = useSearchParams()
  const provider = searchParams.get('provider')

  if (provider !== 'email') {
    return (
      <p>
        <Link
          href={`/early-access?provider=email`}
          className="font-light text-sm text-center block"
        >
          Sign up with email to join early access
        </Link>
      </p>
    )
  } else {
    return (
      <div>
        <EarlyAccessSignup allowEmail={true} redirectMethod={'client'} />
      </div>
    )
  }
}
