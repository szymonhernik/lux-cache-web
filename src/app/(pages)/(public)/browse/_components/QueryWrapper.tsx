'use client'
import { InitialPostsQueryResult } from '@/utils/types/sanity/sanity.types'
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { useState } from 'react'

export default function QueryWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient()
  // const [queryClient] = useState(
  //   () =>
  //     new QueryClient({
  //       defaultOptions: {
  //         queries: {
  //           // With SSR, we usually want to set some default staleTime
  //           // above 0 to avoid refetching immediately on the client
  //           // staleTime: 60 * 1000
  //         }
  //       }
  //     })
  // )
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>
  )
}
