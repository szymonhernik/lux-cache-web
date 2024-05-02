'use client'
import { createUrl } from '@/utils/helpers'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function SearchInput() {
  const currentPath = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const val = e.target as HTMLFormElement
    const search = val.search as HTMLInputElement
    const newParams = new URLSearchParams(searchParams.toString())

    if (search.value) {
      newParams.set('q', search.value)
    } else {
      newParams.delete('q')
    }

    router.push(createUrl(currentPath, newParams))
  }

  return (
    <form onSubmit={onSubmit} className=" relative w-full  ">
      <input
        key={searchParams?.get('q')}
        type="text"
        name="search"
        placeholder="SEARCH"
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
        className="w-full   border-b-[1px]  bg-transparent py-1  text-lg text-white focus:ring-0  focus:ring-offset-0 focus:outline-none uppercase italic font-semibold placeholder:text-neutral-400 placeholder:uppercase "
      />
    </form>
  )
}
