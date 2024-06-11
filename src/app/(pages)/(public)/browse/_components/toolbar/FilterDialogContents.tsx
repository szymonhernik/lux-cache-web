'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ToolbarDialog'
import { FilterGroupsQueryResult } from '@/utils/types/sanity/sanity.types'
import { useEffect, useState } from 'react'
import { Button } from '@/components/shadcn/ui/button'
import s from './SearchInput/SearchInput.module.css'

import { FilterGroupsSchema } from '@/utils/types/zod/types'
import { useQuery } from '@tanstack/react-query'
import { getFilteredPosts } from '@/utils/fetch-helpers/client'

type Props = {
  filterGroups: FilterGroupsQueryResult['filterGroups']
}

export default function FilterDialogContents(props: Props) {
  const { filterGroups } = props

  const searchParams = useSearchParams()
  const filters = searchParams.get('filter')
  const filtersArray = filters ? filters.split(',') : []
  const [tagsSelected, setTagsSelected] = useState<string[]>(
    filtersArray ? filtersArray : []
  )
  const router = useRouter()
  const pathname = usePathname()
  useEffect(() => {
    setTagsSelected(filtersArray)
  }, [searchParams])

  // TODO: upon selecting a tag, it will have to look through posts to find the ones that have the tag and allow only tags that are matching

  // When a filter is selected, i need to fetch the posts that have that tag, and then filter the tags that are available to select (if a tag is not in the posts, it should not be selectable)

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['filter', tagsSelected ? tagsSelected : ''],
    staleTime: 5 * 60 * 1000, //  5 minutes
    queryFn: () => {
      if (tagsSelected.length > 0) {
        return getFilteredPosts(tagsSelected)
      } else {
        return null
      }
    }
    // enabled: searchValue !== null
  })
  const availableFilters = data?.map((post) => post.filters).flat()
  const flattenedFilters = availableFilters?.flat()

  // Extract slugs and remove duplicates using a Set
  const uniqueSlugs = [
    ...new Set(flattenedFilters?.map((filter) => filter?.slug))
  ]

  // console.log('uniqueSlugs:', uniqueSlugs)

  const isFilterAvailable = (slug: string | undefined) => {
    return uniqueSlugs.length === 0 || uniqueSlugs.includes(slug!)
  }

  return (
    <>
      <DialogContent className={`h-dvh overlay-y-auto p-0  m-0 `}>
        <div
          className={`space-y-16 overflow-y-auto pt-24 pb-36 px-6 lg:px-24 ${tagsSelected.length > 0 && s.shadowOverview}`}
        >
          {/* <h1 className="font-semibold uppercase">ARTISTS</h1> */}

          {filterGroups &&
            filterGroups?.map((filterGroup) => (
              <div key={filterGroup._id} className="flex flex-col gap-2 ">
                <h1 className="font-semibold uppercase ">
                  {filterGroup.title}
                </h1>
                <ul className="space-y-2">
                  {filterGroup?.groupFilters?.map((groupFilter) => (
                    <li key={groupFilter.title}>
                      <button
                        disabled={
                          !isFilterAvailable(groupFilter?.slug!) || isLoading
                        }
                        className={`px-6 py-2 rounded-3xl text-xs lg:text-sm uppercase ${
                          tagsSelected.includes(groupFilter.slug!)
                            ? 'bg-white text-black border-gray-300'
                            : 'bg-black text-white border-black'
                        } 
                        ${isLoading && 'animate-pulse !text-neutral-500'}
                        ${!isFilterAvailable(groupFilter?.slug!) && '!text-neutral-500 '}`}
                        onClick={() => {
                          // Ensure slug is not null
                          setTagsSelected((prev) => {
                            if (prev.includes(groupFilter.slug!)) {
                              return prev.filter(
                                (tag) => tag !== groupFilter.slug
                              )
                            } else {
                              return [...prev, groupFilter.slug!]
                            }
                          })
                        }}
                      >
                        {groupFilter.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        <DialogFooter className="fixed w-max mx-auto left-0 right-0 bottom-8 lg:bottom-16 ">
          {tagsSelected.length > 0 ? (
            <DialogClose asChild>
              <Button
                onClick={() => {
                  router.push(`${pathname}?filter=${tagsSelected.join(',')}`)
                  //  setTagsSelected([])
                }}
                size={'xl'}
              >
                Apply
              </Button>
            </DialogClose>
          ) : tagsSelected !== filtersArray ? (
            <DialogClose asChild>
              <Button
                onClick={() => {
                  router.push(`${pathname}`)
                }}
                size={'lg'}
              >
                Apply
              </Button>
            </DialogClose>
          ) : (
            <Button disabled={true} size={'xl'}>
              Apply
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </>
  )
}
