import { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'

import '@/styles/main.css'
import { getURL } from '@/utils/helpers'

import { Providers } from '@/components/providers/providers'
import QueryWrapper from '../components/providers/QueryWrapper'

const suisseSans = localFont({
  src: [
    {
      path: '../../public/fonts/SuisseIntl-Regular-WebTrial.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/SuisseIntl-RegularItalic-WebTrial.woff2',
      weight: '400',
      style: 'italic'
    },
    {
      path: '../../public/fonts/SuisseIntl-SemiBold-WebTrial.woff2',
      weight: '600',
      style: 'normal'
    },
    {
      path: '../../public/fonts/SuisseIntl-SemiBoldItalic-WebTrial.woff2',
      weight: '600',
      style: 'italic'
    }
  ],
  display: 'swap',
  variable: '--font-suisseSans'
})
const suisseNeue = localFont({
  src: [
    {
      path: '../../public/fonts/SuisseNeue-Regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/SuisseNeue-RegularItalic.woff2',
      weight: '400',
      style: 'italic'
    }
  ],
  display: 'swap',
  variable: '--font-suisseNeue'
})

const meta = {
  title:
    'Lux Cache | Tools. support and insight to experimental music production.',
  description: 'Tools. support and insight to experimental music production.',
  // cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: getURL()
}
export const viewport: Viewport = {
  themeColor: '#FAFAFA'
}
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: meta.title,
    description: meta.description,
    referrer: 'origin-when-cross-origin',
    keywords: [
      'Music production',
      'Tools',
      'Discord community',
      'Tutorials',
      'Lux Cache'
    ],
    authors: [{ name: 'Szymon Eda Hernik', url: 'https://luxcache.com/' }],
    creator: 'Lux Cache',
    publisher: 'Lux Cache',
    robots: meta.robots,
    icons: { icon: meta.favicon },
    metadataBase: new URL(meta.url),
    openGraph: {
      url: meta.url,
      title: meta.title,
      description: meta.description,
      // images: [meta.cardImage],
      type: 'website',
      siteName: meta.title
    },
    twitter: {
      card: 'summary_large_image',
      site: '@Lux Cache',
      creator: 'Szymon Eda Hernik',
      title: meta.title,
      description: meta.description
      // images: [meta.cardImage]
    }
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${suisseSans.variable}  ${suisseNeue.variable}`}
    >
      <Providers>
        <QueryWrapper>
          <body className={` loading !pointer-events-auto`}>
            {props.children}
          </body>
        </QueryWrapper>
      </Providers>
    </html>
  )
}
