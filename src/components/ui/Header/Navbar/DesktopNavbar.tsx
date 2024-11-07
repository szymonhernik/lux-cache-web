'use client'

import Link from 'next/link'
import Logo from '@/components/icons/Logo'

import clsx from 'clsx'
import { usePathname, useRouter } from 'next/navigation'
import { links } from '../GlobalNav'

export default function DesktopNavbar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="sticky top-0 right-0 z-auto flex w-navbarDesktop flex-col">
      <div className="flex h-navbar items-center px-4 py-4">
        <Link
          href="/"
          className="group flex w-fit mx-auto items-center justify-center gap-x-2.5 bg-secondary"
        >
          <div className="block">
            <Logo width="140" height="50" />
          </div>
        </Link>
      </div>

      <div className="flex flex-col justify-center h-[calc(100vh-8rem)]">
        <nav className="space-y-8 p-4 -mt-16">
          <div className="space-y-4">
            {links.map((link) => {
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href == '/browse') {
                      // console.log('pathname is browse')
                      e.preventDefault()
                      router.push('/browse')
                      router.refresh()
                    }
                  }}
                  className={clsx(
                    'flex  grow items-center text-2xl gap-2  ',
                    {
                      'text-primary-foreground': pathname === link.href
                    },
                    {
                      'text-secondary-foreground': pathname != link.href
                    }
                  )}
                >
                  <p className="font-normal">{link.name}</p>
                </Link>
              )
            })}
          </div>
          <div className="text-zinc-500 flex flex-col text-sm gap-2">
            <a href="">
              <span>↳</span> discord
            </a>
            <a href="">
              <span>↳</span> instagram
            </a>
          </div>
        </nav>
      </div>
    </div>
  )
}
