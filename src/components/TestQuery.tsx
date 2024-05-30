// @ts-nocheck
'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function TestQuery() {
  const [clicked, setClicked] = useState(false)
  const router = useRouter()
  const { data, isLoading, isFetching, isError, isSuccess, refetch } = useQuery(
    {
      queryKey: ['posts-test'],
      staleTime: 10000,
      queryFn: () =>
        fetch('https://jsonplaceholder.typicode.com/users').then((res) =>
          res.json()
        )
    }
  )
  console.log('isFetching: ', isFetching)

  const handleClick = () => {
    router.refresh()
    // isSuccess && setClicked(false)
  }
  const handleRefetch = () => {
    refetch()
  }

  return (
    <>
      <button
        onClick={() => {
          handleClick()
        }}
        className="w-fit border-2 p-4"
      >
        Download users
      </button>
      <button
        onClick={() => {
          handleRefetch()
        }}
        className="w-fit border-2 p-4"
      >
        Refetch users
      </button>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error</div>
        ) : (
          <div>{data?.map((user) => <div key={user.id}>{user.name}</div>)}</div>
        )}
      </div>
    </>
  )
}
