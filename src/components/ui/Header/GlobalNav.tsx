import { getSettings } from '@/sanity/loader/loadQuery'
import DesktopNavbar from './Navbar/DesktopNavbar'
import MobileNavbar from './Navbar/MobileNavbar'

export default async function GlobalNav() {
  const settings = await getSettings()
  const socialLinks = settings?.data?.linksSocials ?? []

  return (
    <>
      <div
        className={` hidden lg:block  lg:w-navbarDesktop lg:static  bg-secondary `}
      >
        <DesktopNavbar socialLinks={socialLinks} />
      </div>
      <div
        className={` z-[20]  w-full sticky top-0  right-0 lg:hidden  bg-secondary `}
      >
        <MobileNavbar socialLinks={socialLinks} />
      </div>
    </>
  )
}
