import clsx from 'clsx'
import Link from 'next/link'
import NavbarAccount from './account/_components/NavbarAccount'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarAccount />
      <section className="w-full lg:max-w-screen-sm mx-auto px-4 mb-32 pt-16">
        {children}
      </section>
    </>
  )
}
