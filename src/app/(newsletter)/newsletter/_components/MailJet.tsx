'use client'
import Logo from '@/components/icons/Logo'
import Link from 'next/link'
import Script from 'next/script'
import { useLayoutEffect } from 'react'
import { useState } from 'react'

export default function MailJet() {
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)

    return () => {
      // Cleanup script when component unmounts
      const script = document.querySelector(
        'script[src="https://app.mailjet.com/pas-nc-embedded-v1.js"]'
      )
      if (script) {
        script.remove()
      }
    }
  }, [])

  return (
    <div className="h-auto w-auto mx-auto flex flex-col mt-24 gap-12 px-4">
      <div className="mx-auto ">
        <Link href="/">
          {/* <Logo width="120" height="80" alt="Lux Cache" /> */}
          <img
            src={`/lcRebrandLogo.webp`}
            alt="Lux Cache logo"
            width={140}
            // height={60}
            // style={{ margin: '40px auto', display: 'block' }}
          />
        </Link>
      </div>
      {mounted && (
        <>
          <Script
            src="https://app.mailjet.com/pas-nc-embedded-v1.js"
            strategy="afterInteractive"
            onLoad={() => {
              // @ts-ignore (iFrameResize is added by the script)
              if (window.iFrameResize) {
                // @ts-ignore
                window.iFrameResize(
                  { checkOrigin: false },
                  '[data-w-type="embedded"]'
                )
              }
            }}
          />
          <iframe
            data-w-type="embedded"
            src="https://s6hio.mjt.lu/wgt/s6hio/xgvz/form?c=bbda019e"
            width="100%"
            style={{ height: '0' }}
          ></iframe>
        </>
      )}
    </div>
  )
}
