'use client'
import { getSearchResults } from '@/utils/fetch-helpers/client'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import ArtistsResults from '../ArtistsResults'
import s from './SearchInput.module.css'
import EpisodesResults from '../EpisodesResults'
import HiddenTagsResults from '../HiddenTagsResults'
import SeriesResults from '../SeriesResults'
import { toast } from 'sonner'

const SearchInput = () => {
  const [searchValue, setSearchValue] = useState<string | null>(null)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isIputEmpty, setIsInputEmpty] = useState(true)

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['search', searchValue ? searchValue : ''],
    staleTime: 5 * 60 * 1000, //  5 minutes
    queryFn: () => {
      return getSearchResults(searchValue)
    }
    // enabled: searchValue !== null
  })
  const handleType = (value: string) => {
    if (value.length > 0) {
      setIsInputEmpty(false)
    } else {
      setIsInputEmpty(true)
      setSearchValue(null)
    }
  }
  const handleFocus = () => {
    setIsInputFocused(true)
  }
  const handleBlur = (event: React.FocusEvent<HTMLFormElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsInputFocused(false)
    }
  }

  function onSubmit(
    e: React.FormEvent<HTMLFormElement> | React.ChangeEvent<HTMLInputElement>
  ) {
    e.preventDefault()

    // fetch the search input
    const val = e.target as HTMLFormElement
    const search = val.search as HTMLInputElement

    // format to lower case
    const searchValueFormatted = search.value.toLowerCase()

    // needs to be at least three characters
    if (search.value.length > 2 || search.value.length == 0) {
      setSearchValue(searchValueFormatted)
    } else {
      toast('Please enter at least 3 characters')
    }
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        className=" relative w-full h-24 mt-16 lg:px-searchXPadding flex items-center gap-4"
        onBlur={handleBlur}
      >
        <input
          key={searchValue ? searchValue : 'default'}
          type="text"
          name="search"
          placeholder="SEARCH"
          autoComplete="off"
          defaultValue={searchValue ? searchValue : ''}
          onFocus={handleFocus}
          onChange={(e) => {
            handleType(e.target.value)
          }}
          className="peer w-46 flex-grow  border-b-[1px]  bg-transparent py-1  text-lg text-white focus:ring-0  focus:ring-offset-0 focus:outline-none uppercase italic font-semibold placeholder:text-neutral-400 placeholder:uppercase animate-all"
        />
        {isInputFocused && (
          <button type="submit" className="w-fit font-semibold text-sm">
            SEARCH
          </button>
        )}
      </form>

      <div
        className={`${s.minimalScrollbar}  flex flex-col items-start gap-12 grow overflow-y-none overflow-x-hidden py-24`}
      >
        {/* Artists */}
        <div className="flex flex-col gap-4 w-full *:lg:px-searchXPadding">
          <h1 className="font-semibold mb-2 text-lg uppercase">Artists</h1>
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
          <h1 className="font-semibold mb-2 text-lg uppercase">Episodes</h1>
          {isLoading && <p className="">Loading...</p>}
          {data && data.posts && data.posts.length > 0 ? (
            <EpisodesResults episodesResults={data.posts} />
          ) : data && data.posts.length == 0 ? (
            <p className=" opacity-50">no results found</p>
          ) : null}
        </div>
        <div className="lg:px-searchXPadding w-full">
          <h1 className="font-semibold mb-2 text-lg uppercase">Series</h1>
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
          <h1 className="font-semibold mb-2 text-lg uppercase">Tags</h1>
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
