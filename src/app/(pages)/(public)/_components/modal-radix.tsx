'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import s from './ModalRadix.module.css'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  Portal
} from '@radix-ui/react-dialog'

export function ModalRadix({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setOpen(true)
  }, [])

  function onDismiss() {
    setOpen(false)
    router.back()
  }

  return mounted ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <Portal>
        <DialogOverlay className={`${s.DialogOverlay} `}>
          <DialogContent
            onEscapeKeyDown={onDismiss}
            onInteractOutside={onDismiss}
            // className="fixed inset-0 flex items-center justify-center bg-black/80 z-[40]"
            className={` ${s.DialogContent} `}
          >
            <div className="bg-white flex flex-col gap-1">
              <DialogClose asChild>
                <button
                  onClick={onDismiss}
                  className="close-button self-end w-fit mt-3 mr-3 text-sm p-4"
                >
                  close
                </button>
              </DialogClose>
              {children}
            </div>
          </DialogContent>
        </DialogOverlay>
      </Portal>
    </Dialog>
  ) : null
}
