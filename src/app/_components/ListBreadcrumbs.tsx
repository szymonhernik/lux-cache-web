'use client'
import { usePathname } from 'next/navigation'
import Breadcrumbs from '../(pages)/(public)/_components/Breadcrumbs'

export default function ListBreadcrumbs() {
  const pathname = usePathname()
  const pathnames = pathname
    .split('/')
    .filter(Boolean)
    .map((name) => ({
      name,
      path: `/${name}`
    }))
  return <Breadcrumbs pathnames={pathnames} />
}
