'use client'

import { type ElementRef, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dialogRef = useRef<ElementRef<'dialog'>>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal()
    }
  }, [mounted])

  function onDismiss() {
    router.back()
  }

  return mounted
    ? createPortal(
        <dialog
          ref={dialogRef}
          className="m-0 h-screen w-screen bg-black/40 flex justify-center items-center"
          onClose={onDismiss}
        >
          {children}
          <button onClick={onDismiss} className="close-button" />
        </dialog>,

        document.getElementById('modal-root')!
      )
    : null
}
