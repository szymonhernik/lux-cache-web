import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export default function Page({
  searchParams
}: {
  searchParams: {
    url: string
    status_description: string
    error_description: string
  }
}) {
  console.log('searchParams', searchParams)
  //   searchParams {
  //     url: '/browse?status=Success!',
  //     status_description: 'You are now signed in.'
  //   }

  // construct the url from both url and status_description
  if (searchParams.status_description) {
    redirect(
      `${searchParams.url}&status_description=${searchParams.status_description}`
    )
  } else if (searchParams.error_description) {
    redirect(
      `${searchParams.url}&error_description=${searchParams.error_description}`
    )
  } else {
    redirect(`${searchParams.url}`)
  }
}

export function generateMetadata(): Metadata {
  return {
    robots: {
      index: false,
      follow: false
    }
  }
}
