import NavbarAccount from './account/_components/NavbarAccount'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:flex xl:max-w-screen-lg xl:mx-auto">
      <NavbarAccount />
      <section className="w-full lg:max-w-screen-sm mx-auto px-4 mb-32 pt-16 lg:mt-32">
        {children}
      </section>
    </div>
  )
}
