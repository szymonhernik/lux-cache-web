'use client'

import { type ElementRef, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { Button } from '@/components/shadcn/ui/button'

export function ModalLogin({
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
    router.back()
  }

  return mounted
    ? createPortal(
        <dialog
          ref={dialogRef}
          className="m-0 h-screen w-screen bg-black/80 flex justify-center items-center z-[100]"
          onClose={onDismiss}
        >
          <div className="bg-white flex flex-col gap-1">
            <button
              onClick={onDismiss}
              className="close-button self-end w-fit mt-3 mr-3 text-sm  p-4"
            >
              {' '}
              close{' '}
            </button>
            {children}
          </div>
        </dialog>,

        document.getElementById('modal-root')!
      )
    : null
}
