'use client'
import { useEffect } from 'react'

export default function MailJet() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://app.mailjet.com/pas-nc-embedded-v1.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div>
      <iframe
        data-w-type="embedded"
        frameBorder="0"
        scrolling="no"
        src="https://s6hio.mjt.lu/wgt/s6hio/xgvz/form?c=bbda019e"
        width="100%"
        style={{ height: '1000px' }}
      ></iframe>
    </div>
  )
}
