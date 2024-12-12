import { headers } from 'next/headers'
import NavbarAccount from './account/_components/NavbarAccount'
import RoleBadge from './account/_components/RoleBadge'

export default function Layout({ children }: { children: React.ReactNode }) {
  const userRole = headers().get('x-user-role')
  return (
    <div className={'lg:flex xl:max-w-screen-lg xl:mx-auto'}>
      {userRole && <RoleBadge userRole={userRole} />}
      <NavbarAccount />
      <section className="w-full lg:max-w-screen-sm mx-auto px-4 mb-32 pt-16 lg:mt-32 ">
        {children}
      </section>
    </div>
  )
}
