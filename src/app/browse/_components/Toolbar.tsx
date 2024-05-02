'use client'
import SearchIcon from '@/components/icons/SearchIcon'

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
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { createUrl } from '@/utils/helpers'
import { Suspense } from 'react'

export default function Toolbar(props: { results: any }) {
  const { results } = props
  return (
    <>
      <div>
        <Filter />
      </div>
      <div className="flex items-center gap-4">
        <button aria-label="Switch View" className="opacity-70">
          View
        </button>
        <div>
          <Suspense fallback={<div>Search skeleton</div>}>
            <Search results={results} />
          </Suspense>
        </div>
      </div>
    </>
  )
}

function Search(props: { results: any }) {
  const router = useRouter()
  const currentPath = usePathname()
  const searchParams = useSearchParams()
  const hasSearchParams = searchParams?.get('q')
  const { results } = props
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
          <SearchResults results={results} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

function Filter() {
  return (
    <Dialog>
      <DialogTrigger className="p-2 focus:ring-2 focus:ring-zinc-950 focus:ring-offset-1 focus:outline-none rounded ">
        Filters
      </DialogTrigger>
      <DialogContent className="h-dvh overlay-y-auto px-24 pt-16">
        <DialogHeader className="space-y-48">
          <div className="w-full h-2 border-b-[1px] border-white"></div>
          <div className="space-y-24">
            <h1 className="font-semibold uppercase">ARTISTS</h1>
            <h1 className="font-semibold uppercase">EPISODES</h1>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
