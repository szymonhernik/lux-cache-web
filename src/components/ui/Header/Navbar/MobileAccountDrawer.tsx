import { createClient } from '@/utils/supabase/client'
import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/shadcn/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/shadcn/ui/drawer'
import { useEffect, useState } from 'react'
import { SignOut } from '@/utils/auth-helpers/server'
import Link from 'next/link'

export default function MobileAccountDrawer() {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [openAccountDrawer, setOpenAccountDrawer] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
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
    setIsLoggingOut(false)
    setOpenAccountDrawer(false)
  }

  return session ? (
    <Drawer
      direction="right"
      open={openAccountDrawer}
      onOpenChange={setOpenAccountDrawer}
    >
      <DrawerTrigger
        onClick={() => setOpenAccountDrawer(true)}
        className="text-right text-xl uppercase italic "
      >
        Account
      </DrawerTrigger>
      <DrawerContent className=" pl-8 pr-4 h-full w-[314px] text-sm right-0 left-auto rounded-none text-white  bg-secondary-inverted border-none justify-start">
        <div className="mt-16  space-y-8 ">
          <p className="font-semibold">{session.user.email}</p>
          <ul className="flex flex-col gap-1">
            <Link href="/account" onClick={() => setOpenAccountDrawer(false)}>
              <li>Account</li>
            </Link>
            <Link href="/bookmarks" onClick={() => setOpenAccountDrawer(false)}>
              <li>Bookmarks</li>
            </Link>
            <Link href="/help" onClick={() => setOpenAccountDrawer(false)}>
              <li>Help</li>
            </Link>
          </ul>
          <form onSubmit={handleLogout}>
            <button type="submit" disabled={isLoggingOut}>
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </button>
          </form>
        </div>

        {/* <DrawerFooter> */}

        {/* <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose> */}
        {/* </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  ) : (
    <Link
      href="/signin/password_signin"
      className="text-right text-xl uppercase italic"
    >
      Sign In
    </Link>
  )
}

function DrawerLinks() {
  return <div>DrawerLinks</div>
}
