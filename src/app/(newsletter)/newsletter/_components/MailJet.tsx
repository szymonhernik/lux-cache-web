'use client'
import Logo from '@/components/icons/Logo'
import Script from 'next/script'

export default function MailJet() {
  return (
    <div className="h-auto w-auto mx-auto flex flex-col mt-24 gap-12">
      <div className="mx-auto">
        <Logo width="120" height="80" alt="Lux Cache" />
      </div>
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
    </div>
  )
}
