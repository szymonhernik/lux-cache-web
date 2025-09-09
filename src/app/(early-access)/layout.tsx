import { Metadata } from 'next'
import { Toaster } from '@/components/ui/Toasts/toaster'

import { Suspense } from 'react'

import '@/styles/main.css'
import { getURL } from '@/utils/helpers'
import Breadcrumbs from '../(pages)/(public)/_components/Breadcrumbs'
import ListBreadcrumbs from '../_components/ListBreadcrumbs'

const meta = {
  title: 'Lux Cache | Early Access',
  description: 'Early Access',
  cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: getURL()
}
export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: meta.title,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description
  }
}

export default async function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      {/* in top left absolutely positioned corner show the breadcrumbs */}
      {/* <div className="absolute top-0 left-0 p-4">
        <ListBreadcrumbs />
      </div> */}

      <div className=" bg-white flex flex-col py-16 min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-8  bg-white border border-gray-200">
          {props.children}
        </div>
      </div>

      <Suspense>
        <Toaster />
      </Suspense>
    </>
  )
}
