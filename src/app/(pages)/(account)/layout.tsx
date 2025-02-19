import { headers } from 'next/headers'
import NavbarAccount from './account/_components/NavbarAccount'
import RoleBadge from './account/_components/RoleBadge'

export default function Layout({ children }: { children: React.ReactNode }) {
  const userRoles = headers().get('x-user-roles')

  // userRole is a string with roles separated by commas so check if it is not null by converting the string to a boolean
  const userRoleIsNotNull = userRoles !== 'null' && userRoles !== null

  return (
    <div className={'lg:flex xl:max-w-screen-lg xl:mx-auto'}>
      {userRoleIsNotNull && userRoles && userRoles.length > 0 && (
        <RoleBadge userRoles={userRoles} />
      )}
      <NavbarAccount />
      <section className="w-full lg:max-w-screen-sm mx-auto px-4 mb-32 pt-16 lg:mt-32 ">
        {children}
      </section>
    </div>
  )
}
