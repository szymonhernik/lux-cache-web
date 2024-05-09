'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavbarAccount() {
  const pathname = usePathname()
  return (
    <nav
      className={clsx(
        `bg-neutral-300 h-64 w-full flex flex-col justify-end p-4 gap-2 text-secondary-foreground text-sm`
      )}
    >
      {links.map((link) => {
        return (
          <Link key={link.name} href={link.href}>
            <p
              className={clsx(``, {
                ' text-primary-foreground': pathname === link.href
              })}
            >
              {link.name}
            </p>
          </Link>
        )
      })}
    </nav>
  )
}

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Account', href: '/account' },
  {
    name: 'Subscription',
    href: '/account/subscription'
  }
]
