'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CloseButton() {
  const router = useRouter()
  // const searchParams = useSearchParams()
  // const filter = searchParams.get('filter')
  return (
    <button
      // onClick={() => {
      //   // router.back()
      //   return router.push(`/browse${filter ? `?filter=${filter}` : ''}`)
      // }}
      onClick={() => {
        // router.back()
        return router.push(`/browse`)
      }}
    >
      close
    </button>
  )
}
