'use client'

import { Button } from '@/components/shadcn/ui/button'
import Link from 'next/link'

export default function BackButton() {
  return (
    <Link href="/browse">
      <Button
        variant={'secondary'}
        className="text-primary-foreground brightness-95 px-3"
        aria-label="Go back to previous page"
      >
        ←
      </Button>
    </Link>
  )
}
