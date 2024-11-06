'use client'

import { createUrl } from '@/utils/helpers'
import {
  usePathname,
  useRouter,
  useSearchParams
} from 'next/navigation'

export default function SwitchView() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const selectedView = searchParams.get('view')
  const filter = searchParams.get('filter')
  const href = createUrl(
    pathname,
    new URLSearchParams({
      ...(selectedView === 'list' ? {} : { view: 'list' }),
      ...(filter && { filter })
    })
  )

  const handleClick = () => {
    router.push(href)
  }

  return (
    <button
      aria-label="Switch View"
      className="opacity-70"
      onClick={handleClick}
    >
      {selectedView === 'list' ? 'Grid View' : 'List View'}
    </button>
  )
}
