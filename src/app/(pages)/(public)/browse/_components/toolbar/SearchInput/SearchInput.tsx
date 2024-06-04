'use client'
import { getSearchResults } from '@/utils/fetch-helpers/client'
import { createUrl } from '@/utils/helpers'
import { MorePostsQueryResult } from '@/utils/types/sanity/sanity.types'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ArtistsResults from '../ArtistsResults'
import s from './SearchInput.module.css'
import EpisodesResults from '../EpisodesResults'
import HiddenTagsResults from '../HiddenTagsResults'
import SeriesResults from '../SeriesResults'

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
        <div className="flex flex-col gap-4 w-full *:lg:px-searchXPadding">
          <h1 className="font-semibold mb-2 text-xl ">Artists</h1>
          {isLoading && <p className="">Loading...</p>}
          <div className="!px-0">
            {data && data.artists && data.artists.length > 0 ? (
              <ArtistsResults artistsResults={data.artists} />
            ) : data && data.artists.length == 0 ? (
              <p className="lg:px-searchXPadding opacity-50">
                no results found
              </p>
            ) : null}
          </div>
        </div>
        {/* Episodes */}
        <div className="lg:px-searchXPadding">
          <h1 className="font-semibold mb-2 text-xl ">Episodes</h1>
          {isLoading && <p className="">Loading...</p>}
          {data && data.posts && data.posts.length > 0 ? (
            <EpisodesResults episodesResults={data.posts} />
          ) : data && data.posts.length == 0 ? (
            <p className=" opacity-50">no results found</p>
          ) : null}
        </div>
        <div className="lg:px-searchXPadding w-full">
          <h1 className="font-semibold mb-2 text-xl  ">Series</h1>
          {isLoading && <p className="">Loading...</p>}
          {data && data.series && data.series.length > 0 ? (
            <div className="">
              {/* {data.series.map((post: any) => (
                <h2 key={post._id}>{post.title}</h2>
              ))} */}
              <SeriesResults seriesResults={data.series} />
            </div>
          ) : data && data.series.length == 0 ? (
            <p className=" opacity-50">no results found</p>
          ) : null}
        </div>
        <div className="lg:px-searchXPadding">
          <h1 className="font-semibold mb-2 text-xl ">Tags</h1>
          {isLoading && <p className="">Loading...</p>}
          {data && data.hiddenTags && data.hiddenTags.length > 0 ? (
            <div className="">
              <HiddenTagsResults hiddenTagsResults={data.hiddenTags} />
            </div>
          ) : data && data.hiddenTags.length == 0 ? (
            <p className=" opacity-50">no results found</p>
          ) : null}
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
