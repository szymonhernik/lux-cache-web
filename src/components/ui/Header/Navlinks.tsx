'use client'

import Link from 'next/link'
import { SignOut } from '@/utils/auth-helpers/server'
import { handleRequest } from '@/utils/auth-helpers/client'
import Logo from '@/components/icons/Logo'
import { usePathname, useRouter } from 'next/navigation'
import { getRedirectMethod } from '@/utils/auth-helpers/settings'
import s from './Navbar.module.css'

interface NavlinksProps {
  user?: any
}

export default function Navlinks({ user }: NavlinksProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null

  return (
    <div className="relative flex flex-col  py-4  md:py-6">
      <div className="">
        <Link href="/" className={s.logo} aria-label="Logo">
          <Logo />
        </Link>
        <nav className="flex flex-col ">
          <Link href="/pricing" className={s.link}>
            Pricing
          </Link>
          {user && (
            <Link href="/account" className={s.link}>
              Account
            </Link>
          )}
        </nav>
      </div>
      <div className=" space-x-8">
        {user ? (
          <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
            <input type="hidden" name="pathName" value={usePathname()} />
            <button type="submit" className={s.link}>
              Sign out
            </button>
          </form>
        ) : (
          <Link href="/signin" className={s.link}>
            Sign In
          </Link>
          // <>
          //   <Link
          //     href="/redirect?url=/signin"
          //     rel="nofollow"
          //     className="sm:invisible"
          //   >
          //     Sign in
          //   </Link>
          //   <Link href="/signin" className="invisible sm:visible">
          //     Sign in
          //   </Link>
          // </>
        )}
      </div>
    </div>
  )
}
