'use client'
import CloseIcon from '@/components/icons/CloseIcon'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CloseButton() {
  const router = useRouter()
  return (
    <button
      className="close-button self-end"
      onClick={() => {
        return router.push(`/browse`)
      }}
    >
      <CloseIcon />
    </button>
  )
}
