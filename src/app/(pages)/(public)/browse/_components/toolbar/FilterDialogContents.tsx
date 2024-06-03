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
import { useState } from 'react'
import { Button } from '@/components/shadcn/ui/button'
import { z } from 'zod'
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers'

// Define Zod schema for validation
const groupFilterSchema = z.object({
  slug: z.string(),
  title: z.string().nullable()
})

const filterGroupSchema = z.object({
  _id: z.string(),
  title: z.string().nullable(),
  slug: z.string().nullable(),
  groupFilters: z.array(groupFilterSchema).nullable()
})

const filterGroupsSchema = z.array(filterGroupSchema)

type Props = {
  filterGroups: FilterGroupsQueryResult['filterGroups']
}

export default function FilterDialogContents(props: Props) {
  const searchParams = useSearchParams()
  const filters = searchParams.get('filter')
  const filtersArray = filters ? filters.split(',') : []
  const [tagsSelected, setTagsSelected] = useState<string[]>(
    filtersArray ? filtersArray : []
  )
  const router = useRouter()
  const pathname = usePathname()
  const { filterGroups } = props
  // console.log('tagsSelected', tagsSelected)

  // TODO: upon selecting a tag, it will have to look through posts to find the ones that have the tag and allow only tags that are matching

  const validatedFilterGroups = filterGroupsSchema.safeParse(filterGroups)

  if (!validatedFilterGroups.success) {
    console.error('Error loading filters.')
    return null
  }

  // console.log('tagsSelected', tagsSelected)
  // console.log('filtersArray', filtersArray)

  return (
    <>
      <DialogContent className="h-dvh overlay-y-auto p-0  m-0 ">
        <div className="space-y-16 overflow-y-auto py-24 px-24">
          {/* <h1 className="font-semibold uppercase">ARTISTS</h1> */}

          {validatedFilterGroups.success ? (
            validatedFilterGroups?.data.map((filterGroup) => (
              <div key={filterGroup._id} className="flex flex-col gap-2">
                <h1 className="font-semibold uppercase ">
                  {filterGroup.title}
                </h1>
                <ul className="space-y-2">
                  {filterGroup?.groupFilters?.map((groupFilter) => (
                    <li key={groupFilter.title}>
                      <button
                        className={`px-6 py-2 rounded-3xl text-sm uppercase ${
                          tagsSelected.includes(groupFilter.slug)
                            ? 'bg-white text-black border-gray-300'
                            : 'bg-black text-white border-black'
                        }`}
                        onClick={() => {
                          // Ensure slug is not null
                          setTagsSelected((prev) => {
                            if (prev.includes(groupFilter.slug)) {
                              return prev.filter(
                                (tag) => tag !== groupFilter.slug
                              )
                            } else {
                              return [...prev, groupFilter.slug]
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
            ))
          ) : (
            <p>We are having problems loading filters...</p>
          )}
        </div>

        <DialogFooter className="fixed w-max mx-auto left-0 right-0 bottom-16 ">
          {tagsSelected.length > 0 ? (
            <DialogClose asChild>
              <Button
                onClick={() => {
                  router.push(`${pathname}?filter=${tagsSelected.join(',')}`)
                  //  setTagsSelected([])
                }}
                size={'lg'}
              >
                Apply
              </Button>
            </DialogClose>
          ) : tagsSelected !== filtersArray ? (
            <DialogClose asChild>
              <Button
                onClick={() => {
                  router.push(`${pathname}`)
                  //  setTagsSelected([])
                }}
                size={'lg'}
              >
                Apply
              </Button>
            </DialogClose>
          ) : (
            <Button disabled={true} size={'lg'}>
              Apply
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </>
  )
}
