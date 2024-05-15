'use client'
import { getStripe } from '@/utils/stripe/client'
import { retrieveProducts } from '@/utils/stripe/server'

import { useState, useEffect } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'

const queryClient = new QueryClient()

// const product = await stripe.products.retrieve('prod_NWjs8kKbJWmuuc')
export const AsyncListInput = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AsyncListInputInside {...props} />
    </QueryClientProvider>
  )
}

export const AsyncListInputInside = (props) => {
  const { schemaType, renderDefault } = props
  const { options } = schemaType
  const { url, formatResponse } = options

  const queryClient = useQueryClient()
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const data = await retrieveProducts()
      formatResponse
      return data
    }
  })

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }
  console.log('data', data)

  return renderDefault({
    ...props,
    schemaType: { ...schemaType, options: { ...options, list: data } }
  })
}
