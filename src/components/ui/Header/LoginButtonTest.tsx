'use client'
import { handleRequest } from '@/utils/auth-helpers/client'
import { SignOut } from '@/utils/auth-helpers/server'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import s from './Navbar.module.css'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// client side component that handles sign in and sign out, depending on the session
// this way we can render some pages where this component appears as static pages
export default function LoginButtonTest() {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  const [session, setSession] = useState()
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      //   @ts-ignore
      setSession(data.session)
    }
    getSession()
  }, [pathname])

  return session ? (
    <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
      <button type="submit" className={s.link}>
        Sign out
      </button>
    </form>
  ) : (
    <Link href="/signin" className={s.link}>
      Sign In
    </Link>
  )
}
