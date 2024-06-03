'use client'
import { getSearchResults } from '@/utils/fetch-helpers/client'
import { createUrl } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SearchInput() {
  const [searchValue, setSearchValue] = useState<string | null>(null)

  const { data, refetch } = useQuery({
    queryKey: ['search', searchValue ? searchValue : ''],
    staleTime: 5 * 60 * 1000, //  5 minutes
    queryFn: () => {
      if (searchValue !== null) {
        return getSearchResults(searchValue)
      } else {
        return null
      }
    },
    enabled: searchValue !== null
  })

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // fetch the search input
    const val = e.target as HTMLFormElement
    const search = val.search as HTMLInputElement
    // format to lower case
    const searchValueFormatted = search.value.toLowerCase()
    setSearchValue(searchValueFormatted)
    // refetch()

    // artists (get from artists)
    // episodes (posts)
    // series (get from episodes)
    // tags (get from episodes)
  }
  console.log('data ', data)

  return (
    <>
      <form onSubmit={onSubmit} className=" relative w-full  ">
        <input
          key={searchValue ? searchValue : 'default'}
          type="text"
          name="search"
          placeholder="SEARCH"
          autoComplete="off"
          defaultValue={searchValue ? searchValue : ''}
          className="w-full   border-b-[1px]  bg-transparent py-1  text-lg text-white focus:ring-0  focus:ring-offset-0 focus:outline-none uppercase italic font-semibold placeholder:text-neutral-400 placeholder:uppercase "
        />
      </form>
      {data && (
        <div className="flex flex-col gap-4">
          {data.artists && (
            <div>
              <h1 className="font-semibold mb-2 text-xl">Artists</h1>
              <div className="flex flex-col divide-y">
                {data.artists.map((artist: any) => (
                  <h2 key={artist._id}>{artist.name}</h2>
                ))}
              </div>
            </div>
          )}
          {data.posts && (
            <div>
              <h1 className="font-semibold mb-2 text-xl">Episodes</h1>
              {data.posts.map((post: any) => (
                <h2 key={post._id}>{post.title}</h2>
              ))}
            </div>
          )}
          {data.series && (
            <div>
              <h1 className="font-semibold mb-2 text-xl">Series</h1>
              {data.series.map((post: any) => (
                <h2 key={post._id}>{post.title}</h2>
              ))}
            </div>
          )}
          {data.hiddenTags && (
            <div>
              <h1 className="font-semibold mb-2 text-xl">Tags</h1>
              {data.hiddenTags.map((post: any) => (
                <h2 key={post._id}>{post.title}</h2>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

// function onSubmit(e: React.FormEvent<HTMLFormElement>) {
//   e.preventDefault()

//   const val = e.target as HTMLFormElement
//   const search = val.search as HTMLInputElement
//   const newParams = new URLSearchParams(searchParams.toString())

//   if (search.value) {
//     newParams.set('q', search.value)
//   } else {
//     newParams.delete('q')
//   }

//   router.push(createUrl(currentPath, newParams))
// }
