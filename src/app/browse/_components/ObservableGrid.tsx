'use client'
import React from 'react'
import { useInView } from 'react-intersection-observer'

export default function ObservableGrid() {
  const items = generateItems()
  return (
    <div className="grid md:grid-cols-2 lg:grid-rows-custom lg:grid-flow-col-dense lg:h-full  gap-0 lg:w-max">
      {items.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  )
}

function ListItem({ item }: { item: { id: number; content: string } }) {
  const { ref, inView, entry } = useInView({
    threshold: 0, // Customize the threshold as needed
    rootMargin: '0px 0px'
  })

  // You can also use `inView` to perform actions when the item is visible
  React.useEffect(() => {
    if (inView) {
      console.log(`Item ${item.id} is in view.`)
      // You could dispatch actions here, like lazy-loading the item details
    }
  }, [inView, item.id])

  return (
    <div
      ref={ref}
      className={`w-full aspect-square flex flex-col items-center justify-center border border-white transition-all duration-1000 ${inView ? 'bg-green-200' : 'bg-pink-900'}`}
    >
      {item.content}
      {inView && <video className="border-white border w-16">video</video>}
    </div>
  )
}

// Generate an array of 100 items
const generateItems = () => {
  return Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    content: `Item ${index + 1}`
  }))
}
