'use client'

import { type ElementRef, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'

export function Modal({
  children,
  onModalDisplayChange
}: {
  children: React.ReactNode
  onModalDisplayChange?: (value: boolean) => void
}) {
  const router = useRouter()
  const dialogRef = useRef<ElementRef<'dialog'>>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleModalDisplayChange = () => {
    if (onModalDisplayChange) {
      onModalDisplayChange(false)
    } else {
      return null
    }
  }

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal()
    }
  }, [mounted])

  function onDismiss() {
    if (!onModalDisplayChange) {
      router.push('/browse')
      // console.log('XXX')
    } else {
      // console.log('Handle close modal')

      handleModalDisplayChange()
    }
  }

  return mounted
    ? createPortal(
        <dialog
          ref={dialogRef}
          className="m-0 h-screen w-screen bg-black/80 flex justify-center items-center"
          onClose={onDismiss}
        >
          {children}
          <button onClick={onDismiss} className="close-button" />
        </dialog>,

        document.getElementById('modal-root')!
      )
    : null
}
