'use client'

import { useState } from 'react'
import Hamburger from 'hamburger-react'
import Link from 'next/link'
import Logo from '@/components/icons/Logo'

import clsx from 'clsx'
import { usePathname, useRouter } from 'next/navigation'

import s from './Navbar.module.css'
import { links } from '../GlobalNav'
import MobileAccountDrawer from './MobileAccountDrawer'

export default function MobileNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="sticky top-0 right-0 z-10 flex w-full flex-col  ">
      <div className="grid grid-cols-3 grid-rows-1 h-navbar-mobile items-center px-4 py-4 ">
        <button
          type="button"
          className={`${s.hamburgerIcon} items-center gap-x-2  `}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Hamburger
            size={32}
            color="#000"
            toggled={isOpen}
            toggle={setIsOpen}
          />
        </button>
        <Link
          href="/"
          className="group flex items-center justify-center gap-x-2.5 bg-secondary"
        >
          <div className="block">
            <Logo width="100" height="40" />
          </div>
        </Link>
        <MobileAccountDrawer />
      </div>

      <div
        className={clsx('overflow-y-auto ', {
          'fixed inset-x-0 bottom-0 top-[3.9rem] mt-px bg-zinc-300 ': isOpen,
          hidden: !isOpen
        })}
      >
        <nav className="space-y-8 p-4 ">
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
                    setIsOpen(!isOpen)
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
