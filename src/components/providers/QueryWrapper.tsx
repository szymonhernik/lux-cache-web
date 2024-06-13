'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'

export default function QueryWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient()

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </React.StrictMode>
  )
}
