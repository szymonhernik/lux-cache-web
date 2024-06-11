import { Metadata } from 'next'
import Footer from '@/components/ui/Footer'
import { Toaster } from '@/components/ui/Toasts/toaster'
import { Toaster as Sonner } from '@/components/shadcn/ui/sonner'

import { PropsWithChildren, Suspense } from 'react'
import localFont from 'next/font/local'

import '@/styles/main.css'
import { getURL } from '@/utils/helpers'

import GlobalNav from '@/components/ui/Header/GlobalNav'
import { draftMode } from 'next/headers'
import LiveVisualEditing from '@/sanity/loader/LiveVisualEditing'

const meta = {
  title:
    'Lux Cache | Tools. support and insight to experimental music production.',
  description: 'Tools. support and insight to experimental music production.',
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
      <div className="flex min-h-screen flex-col lg:flex-row-reverse">
        <GlobalNav />
        <main
          id="skip"
          className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]  flex-1 lg:overflow-auto "
        >
          {props.children}
        </main>

        {/* <Footer /> */}
      </div>
      <Suspense>
        <Toaster />
      </Suspense>
      <Suspense>
        <Sonner />
      </Suspense>

      {draftMode().isEnabled && <LiveVisualEditing />}

      {/*  */}
    </>
  )
}
