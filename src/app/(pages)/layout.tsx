import { Metadata } from 'next'
import { Toaster } from '@/components/ui/Toasts/toaster'
import { Toaster as Sonner } from '@/components/shadcn/ui/sonner'

import { Suspense } from 'react'

import '@/styles/main.css'
import { getURL } from '@/utils/helpers'

import GlobalNav from '@/components/ui/Header/GlobalNav'
import { draftMode } from 'next/headers'
import LiveVisualEditing from '@/sanity/loader/LiveVisualEditing'
import AccountTabDesktop from './(public)/_components/AccountTabDesktop'

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
          className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]  flex-1 relative"
        >
          <AccountTabDesktop />
          {props.children}
        </main>

        {/* <Footer /> */}
      </div>
      <div id="modal-root" />
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
