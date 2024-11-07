import DesktopNavbar from './Navbar/DesktopNavbar'
import MobileNavbar from './Navbar/MobileNavbar'

export const links = [
  { name: 'browse', href: '/browse' },
  { name: 'about', href: '/about' },
  { name: 'pricing', href: '/pricing' },
  { name: 'FAQ', href: '/faq' },
  // { name: 'mentoring', href: '/mentoring' },
  { name: 'contact', href: '/contact' }
]

export default async function GlobalNav() {
  return (
    <>
      <div
        className={` hidden lg:block  lg:w-navbarDesktop lg:static  bg-secondary `}
      >
        <DesktopNavbar />
      </div>
      <div
        className={` z-[20]  w-full sticky top-0  right-0 lg:hidden  bg-secondary `}
      >
        <MobileNavbar />
      </div>
    </>
  )
}
