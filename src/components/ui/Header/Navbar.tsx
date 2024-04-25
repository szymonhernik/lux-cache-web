'use client';

import { useState, useEffect } from 'react';
import Hamburger from 'hamburger-react';
import Link from 'next/link';
import SignInOutLink from './SignInOutLink';
import Logo from '@/components/icons/Logo';
import s from './Navbar.module.css';
import { User } from '@supabase/supabase-js';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  user: User | null;
}

const links = [
  // { name: 'home', href: '/' },
  { name: 'browse', href: '/browse' },
  { name: 'about', href: '/about' },
  { name: 'pricing', href: '/pricing' },
  { name: 'FAQ', href: '/FAQ' },
  { name: 'contact', href: '/contact' },
  { name: 'account', href: '/account' }
];

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <div className="w-full sticky top-0 left-0 lg:w-64 lg:static  bg-zinc-100 ">
      <div className="sticky top-0 right-0 z-10 flex w-full flex-col  lg:bottom-0 lg:z-auto lg:space-around ">
        <div className="flex h-16 items-center px-4 py-4 lg:h-auto">
          <Link
            href="/"
            className="group flex w-full items-center justify-center gap-x-2.5"
            onClick={close}
          >
            <div className="bg-zinc-100 ">
              <Logo />
            </div>
          </Link>
        </div>
        <button
          type="button"
          className="group absolute right-0 top-0 flex h-16 items-center gap-x-2 px-4 lg:hidden"
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
              'fixed inset-x-0 bottom-0 top-[3.4rem] mt-px bg-zinc-300 lg:bg-transparent':
                isOpen,
              hidden: !isOpen
            }
          )}
        >
          <nav className="space-y-8 p-4 ">
            <div className="space-y-4">
              {links.map((link) => {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={clsx(
                      'flex  grow items-center text-xl gap-2  ',
                      {
                        'text-black': pathname === link.href
                      },
                      {
                        'text-zinc-500': pathname != link.href
                      }
                    )}
                  >
                    <p className="font-normal">{link.name}</p>
                  </Link>
                );
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
  );
}
