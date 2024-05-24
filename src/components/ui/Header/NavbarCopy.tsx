'use client'

import { useState, useEffect } from 'react'
import Hamburger from 'hamburger-react'
import Link from 'next/link'
import SignInOutLink from './SignInOutLink'
import Logo from '@/components/icons/Logo'

import { User } from '@supabase/supabase-js'
import clsx from 'clsx'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { handleRequest } from '@/utils/auth-helpers/client'
import { SignOut } from '@/utils/auth-helpers/server'
import LoginButtonTest from './LoginButtonTest'

// interface NavbarProps {
//   user: User | null
// }

const links = [
  // { name: 'home', href: '/' },
  { name: 'browse', href: '/browse' },
  { name: 'about', href: '/about' },
  { name: 'pricing', href: '/pricing' },
  { name: 'FAQ', href: '/FAQ' },
  { name: 'contact', href: '/contact' },
  { name: 'account', href: '/account' }
]

export default function NavbarCopy() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)

  const filter = searchParams.get('filter')

  console.log('filter', filter)

  return (
    <div className="z-[20]  w-full sticky top-0 left-0 lg:w-navbarDesktop lg:static  bg-secondary ">
      <div className="sticky top-0 right-0 z-10 flex w-full flex-col  lg:bottom-0 lg:z-auto lg:space-around ">
        <div className="flex h-navbar-mobile items-center px-4 py-4 lg:h-navbar">
          <Link
            href="/"
            className="group flex w-min mx-auto items-center justify-center gap-x-2.5"
            onClick={close}
          >
            <div className="bg-secondary ">
              <Logo />
            </div>
          </Link>
        </div>
        <button
          type="button"
          className="group absolute right-0 top-0 flex h-navbar-mobile items-center gap-x-2 px-4 lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Hamburger
            size={24}
            color="#000"
            toggled={isOpen}
            toggle={setIsOpen}
          />
        </button>
        <div
          className={clsx(
            'overflow-y-auto lg:static  lg:flex lg:flex-col lg:justify-center lg:h-[calc(100vh-8rem)]',
            {
              'fixed inset-x-0 bottom-0 top-[3.9rem] mt-px bg-zinc-300 lg:bg-transparent':
                isOpen,
              hidden: !isOpen
            }
          )}
        >
          <nav className="space-y-8 p-4 ">
            <div className="space-y-4">
              {links.map((link) => {
                return link.name !== 'browse' ? (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(!isOpen)}
                    className={clsx(
                      'flex  grow items-center text-xl gap-2  ',
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
                ) : filter ? (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(!isOpen)}
                    className={clsx(
                      'flex  grow items-center text-xl gap-2  ',
                      {
                        'text-primary-foreground': pathname === link.href
                      },
                      {
                        'text-secondary-foreground': pathname != link.href
                      }
                    )}
                  >
                    <p className="font-normal">{link.name}</p>
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(!isOpen)}
                    className={clsx(
                      'flex  grow items-center text-xl gap-2  ',
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
              {/* This solution makes the route to always refresh the whole route when moving to browse. for example if i didnt use browse page before it shouldn't use a href but Link. it should only be if i applied filter, then went to a different route and back to browse..   */}
            </div>
            <div className="text-zinc-500 flex flex-col text-sm gap-2">
              <a href="">
                <span>↳</span> discord
              </a>
              <a href="">
                <span>↳</span> instagram
              </a>
            </div>
            <div className="">
              <LoginButtonTest />
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
