'use client'

import { useState } from 'react'
import Hamburger from 'hamburger-react'
import Link from 'next/link'
import Logo from '@/components/icons/Logo'

import clsx from 'clsx'
import { usePathname, useRouter } from 'next/navigation'

import s from './Navbar.module.css'

// interface NavbarProps {
//   user: User | null
// }

const links = [
  // { name: 'home', href: '/' },
  { name: 'browse', href: '/browse' },
  { name: 'about', href: '/about' },
  { name: 'pricing', href: '/pricing' },
  { name: 'FAQ', href: '/faq' },
  // { name: 'mentoring', href: '/mentoring' },
  { name: 'contact', href: '/contact' }
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)

  return (
    <div
      className={` z-[20]  w-full sticky top-0  right-0 lg:w-navbarDesktop lg:static  bg-secondary `}
    >
      <div className="sticky top-0 right-0 z-10 flex w-full flex-col  lg:bottom-0 lg:z-auto lg:space-around lg:w-navbarDesktop">
        <div className="flex h-navbar-mobile items-center px-4 py-4 lg:h-navbar">
          <Link
            href="/"
            className="group flex w-fit mx-auto items-center justify-center gap-x-2.5 bg-secondary"
            onClick={close}
          >
            <div className="hidden lg:block">
              <Logo width="140" height="50" />
            </div>
            <div className="block lg:hidden">
              <Logo width="100" height="40" />
            </div>
          </Link>
        </div>
        <button
          type="button"
          className={`${s.hamburgerIcon} group absolute left-0 top-0 flex h-navbar-mobile items-center gap-x-2 px-4 lg:hidden`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Hamburger
            size={32}
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
          <nav className="space-y-8 p-4 lg:-mt-16 ">
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
    </div>
  )
}
