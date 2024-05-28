'use client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CloseButton() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter')
  return (
    <button
      onClick={() => {
        // router.back()
        return router.push(`/browse${filter ? `?filter=${filter}` : ''}`)
      }}
    >
      close
    </button>
  )
}
