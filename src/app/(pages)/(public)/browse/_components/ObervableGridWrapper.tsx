'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const queryClient = new QueryClient()
export default function ObservableGridWrapper({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </React.StrictMode>
  )
}
