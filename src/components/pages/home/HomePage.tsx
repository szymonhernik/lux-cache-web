'use client'

import { PostsQueryResult } from '@/utils/types/sanity/sanity.types'
import { EncodeDataAttributeCallback } from '@sanity/react-loader'
import { useEffect, useState } from 'react'

export interface HomePageProps {
  data: PostsQueryResult | null
  encodeDataAttribute?: EncodeDataAttributeCallback
}

export default function HomePage({ data, encodeDataAttribute }: HomePageProps) {
  const { posts } = data || {}

  return (
    <main className="container mt-16 lg:mt-4 mx-auto grid grid-cols-1 ">
      <Countdown />
    </main>
  )
}

export function Countdown() {
  const [partyTime, setPartyTime] = useState(false)
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const target = new Date('12/01/2024 00:00:00')

    const interval = setInterval(() => {
      const now = new Date()
      const difference = target.getTime() - now.getTime()

      const d = Math.floor(difference / (1000 * 60 * 60 * 24))
      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((difference % (1000 * 60)) / 1000)

      setDays(d)
      setHours(h)
      setMinutes(m)
      setSeconds(s)

      if (difference < 0) {
        setPartyTime(true)
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="">
      {partyTime ? (
        <>
          <h1>let's go!</h1>
        </>
      ) : (
        <>
          <div className="timer-wrapper w-full h-[95vh] flex flex-col gap-1 justify-center items-center font-semibold text-xs uppercase">
            <p>Lux Cache </p>
            <p>Premiere on 1 December 2024 </p>
            <div className="timer-inner flex">
              <span className="time">
                {days} days, {hours} hours, {minutes} minutes, {seconds} seconds
                left
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
