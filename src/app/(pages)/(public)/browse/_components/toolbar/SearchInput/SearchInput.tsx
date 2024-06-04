'use client'
import { getSearchResults } from '@/utils/fetch-helpers/client'
import { createUrl } from '@/utils/helpers'
import { MorePostsQueryResult } from '@/utils/types/sanity/sanity.types'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ArtistsResults from '../ArtistsResults'
import s from './SearchInput.module.css'

const SearchInput = () => {
  const [searchValue, setSearchValue] = useState<string | null>(null)

  const { data, refetch, isLoading } = useQuery({
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
  // console.log('data ', data)

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="relative w-full h-24 mt-16 lg:px-searchXPadding"
      >
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

      <div
        className={`${s.minimalScrollbar} flex flex-col items-start gap-16 grow overflow-y-none overflow-x-hidden py-24`}
      >
        {/* Artists */}
        <div className="flex flex-col gap-4 w-full">
          <h1 className="font-semibold mb-2 text-xl lg:px-searchXPadding">
            Artists
          </h1>
          {isLoading && <p className="lg:px-searchXPadding">Loading...</p>}
          {data && data.artists && (
            <ArtistsResults artistsResults={data.artists} />
          )}
        </div>
        {/* Episodes */}
        <div>
          <h1 className="font-semibold mb-2 text-xl lg:px-searchXPadding">
            Episodes
          </h1>
          {isLoading && <p className="lg:px-searchXPadding">Loading...</p>}
          {data && data.posts && (
            <div className="lg:px-searchXPadding">
              {data.posts.map((post: any) => (
                <h2 key={post._id}>{post.title}</h2>
              ))}
            </div>
          )}
        </div>
        <div>
          <h1 className="font-semibold mb-2 text-xl lg:px-searchXPadding">
            Series
          </h1>
          {isLoading && <p className="lg:px-searchXPadding">Loading...</p>}
          {data && data.series && (
            <div className="lg:px-searchXPadding">
              {data.series.map((post: any) => (
                <h2 key={post._id}>{post.title}</h2>
              ))}
            </div>
          )}
        </div>
        <div>
          <h1 className="font-semibold mb-2 text-xl lg:px-searchXPadding">
            Tags
          </h1>
          {isLoading && <p className="lg:px-searchXPadding">Loading...</p>}
          {data && data.hiddenTags && (
            <div className="lg:px-searchXPadding">
              {data.hiddenTags.map((post: any) => (
                <h2 key={post._id}>{post.title}</h2>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default SearchInput

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
