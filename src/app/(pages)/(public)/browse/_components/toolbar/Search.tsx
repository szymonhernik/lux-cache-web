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
} from './ToolbarDialog'
import SearchInput from './SearchInput'
import { useState } from 'react'

export default function Search() {
  const router = useRouter()
  const currentPath = usePathname()
  const searchParams = useSearchParams()
  const hasSearchParams = searchParams?.get('q')
  const [isOpen, setIsOpen] = useState(false)
  // const { results } = props
  return (
    <Dialog
      // defaultOpen={true}
      open={isOpen ? true : false}
      onOpenChange={(e) => {
        if (e === false) {
          setIsOpen(false)
        } else {
          setIsOpen(true)
        }
      }}
    >
      <DialogTrigger className="p-2 focus:ring-2 focus:ring-zinc-950  focus:ring-offset-1 focus:outline-none rounded ">
        Search
      </DialogTrigger>
      <DialogContent className="h-dvh flex flex-col ">
        {/* <DialogHeader className="space-y-48"> */}
        <SearchInput />
        {/* <SearchResults /> */}
        {/* </DialogHeader> */}
      </DialogContent>
    </Dialog>
  )
}
