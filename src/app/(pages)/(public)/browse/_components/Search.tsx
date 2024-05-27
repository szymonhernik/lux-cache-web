'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import SearchInput from './SearchInput'
import SearchResults from './SearchResults'

export default function Search() {
  const router = useRouter()
  const currentPath = usePathname()
  const searchParams = useSearchParams()
  const hasSearchParams = searchParams?.get('q')
  // const { results } = props
  return (
    <Dialog
      // defaultOpen={true}
      // open={hasSearchParams ? true : false}
      onOpenChange={(e) => {
        if (e === false) {
          router.push(currentPath)
        }
      }}
    >
      <DialogTrigger className="p-2 focus:ring-2 focus:ring-zinc-950  focus:ring-offset-1 focus:outline-none rounded ">
        Search
      </DialogTrigger>
      <DialogContent className="h-dvh overlay-y-auto px-24 pt-16">
        <DialogHeader className="space-y-48">
          <SearchInput />
          {/* <SearchResults /> */}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
