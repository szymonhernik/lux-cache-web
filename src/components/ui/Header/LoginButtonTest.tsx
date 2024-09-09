'use client'
import { handleRequest } from '@/utils/auth-helpers/client'
import { SignOut } from '@/utils/auth-helpers/server'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import s from './Navbar.module.css'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/shadcn/ui/sheet'
import clsx from 'clsx'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { ChevronLeftOwn, ChevronRightOwn } from '../Icons/ChevronRightOwn'

// client side component that handles sign in and sign out, depending on the session
// this way we can render some pages where this component appears as static pages
export default function LoginButtonTest() {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const [openAccountPanel, setOpenAccountPanel] = useState(false)

  const [session, setSession] = useState<any>()
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      //   @ts-ignore
      setSession(data.session)
    }
    getSession()
  }, [pathname])

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingOut(true)
    try {
      const result = await SignOut(new FormData(e.target as HTMLFormElement))
      router.push(result)
    } catch (error) {
      console.error('Logout error:', error)
    }
    setOpenAccountPanel(false)
    setIsLoggingOut(false)
  }

  return session ? (
    <div
      className={clsx(' ', {
        'w-screen h-screen text-white bg-black backdrop-blur-sm bg-opacity-50 flex  justify-end ':
          openAccountPanel
      })}
    >
      {openAccountPanel ? (
        <div className={clsx('flex flex-col bg-secondary-inverted ', {})}>
          <button
            className=" self-end py-4 pr-6 pl-4 flex flex-col items-end text-xl hover:cursor-pointer"
            onClick={() => {
              setOpenAccountPanel(false)
            }}
          >
            <p className="h-12  opacity-0">Account</p>

            <ChevronRightOwn />
          </button>
          {openAccountPanel && (
            <div className="w-80 py-4 pl-8 pr-4 mt-16 text-sm space-y-8">
              <p className="font-semibold">{session.user.email}</p>

              <ul
                className="flex flex-col gap-1"
                onClick={() => {
                  setOpenAccountPanel(false)
                }}
              >
                <Link href="/account">
                  <li>Account</li>
                </Link>
                <Link
                  href="/bookmarks"
                  onClick={() => {
                    setOpenAccountPanel(false)
                  }}
                >
                  <li>Bookmarks</li>
                </Link>
                <Link
                  href="/help"
                  onClick={() => {
                    setOpenAccountPanel(false)
                  }}
                >
                  <li>Help</li>
                </Link>
              </ul>
              <form onSubmit={handleLogout}>
                <button type="submit" disabled={isLoggingOut}>
                  {isLoggingOut ? 'Logging out...' : 'Log out'}
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <button
          className=" self-end py-4 pr-6 pl-4 flex flex-col items-end text-xl hover:cursor-pointer"
          onClick={() => {
            setOpenAccountPanel(true)
          }}
        >
          <p className="h-12 pt-1 lg:pt-0">Account</p>

          <div className="hidden lg:block">{/* <ChevronLeftOwn /> */}</div>
        </button>
      )}
    </div>
  ) : (
    <div className={`py-4 pr-6 pl-4 flex flex-col items-end text-xl `}>
      <Link href="/signin/password_signin" className="">
        Sign In
      </Link>
      {/* <Link href="/signin/password_signin" className="hidden sm:block">
        Sign In
      </Link>
      <a href="/signin" className="sm:hidden ">
        Sign In
      </a> */}
    </div>
  )
}
