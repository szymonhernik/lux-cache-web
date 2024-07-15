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
  console.log('session', session)

  return session ? (
    // <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
    //   <button type="submit" className={s.link}>
    //     Sign out
    //   </button>
    // </form>
    // <button onClick={()=> {}}>Account</button>
    // <button>Account</button>
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
              setOpenAccountPanel(!openAccountPanel)
            }}
          >
            <p className="h-12  opacity-0">Account</p>

            <ChevronRightOwn />
          </button>
          {openAccountPanel && (
            <div className="w-80 py-4 pl-8 pr-4 mt-16 text-sm space-y-8">
              <p className="font-semibold">{session.user.email}</p>

              <ul
                className="space-y-1"
                onClick={() => {
                  setOpenAccountPanel(false)
                }}
              >
                <Link href="/account">
                  <li>Account</li>
                </Link>
                <Link
                  href="/bookmarked"
                  onClick={() => {
                    setOpenAccountPanel(false)
                  }}
                >
                  <li>Bookmarked</li>
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
              <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
                <button type="submit">Log out</button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <button
          className=" self-end py-4 pr-6 pl-4 flex flex-col items-end text-xl hover:cursor-pointer"
          onClick={() => {
            setOpenAccountPanel(!openAccountPanel)
          }}
        >
          <p className="h-12 pt-1 lg:pt-0">Account</p>

          <div className="hidden lg:block">
            <ChevronLeftOwn />
          </div>
        </button>
      )}
    </div>
  ) : (
    // <Sheet>
    //   <SheetTrigger>Account</SheetTrigger>
    //   <SheetContent>
    //     <SheetHeader>
    //       <SheetTitle>Are you absolutely sure?</SheetTitle>
    //       <SheetDescription>
    //         This action cannot be undone. This will permanently delete your
    //         account and remove your data from our servers.
    //       </SheetDescription>
    //     </SheetHeader>
    //   </SheetContent>
    // </Sheet>
    <div className={`py-4 pr-6 pl-4 flex flex-col items-end text-xl `}>
      <Link href="/signin/password_signin">Sign In</Link>
    </div>
  )
}
