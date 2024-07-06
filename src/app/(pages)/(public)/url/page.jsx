'use client'
import { useState } from 'react'
import { Button } from '@/components/shadcn/ui/button'

export default function Page() {
  const [inputUrl, setInputUrl] = useState('')
  const [thumbnailUrls, setThumbnailUrls] = useState([])

  const generateThumbnailUrls = (url) => {
    if (!url) return

    const baseUrl = url.replace('.mp4', '.png')
    const parts = baseUrl.split('/upload/')
    const firstThumbnailUrl = `${parts[0]}/upload/pg_1/w_25/h_25/f_png/${parts[1]}`
    const secondThumbnailUrl = `${parts[0]}/upload/pg_1/w_1000/h_1000/f_png/${parts[1]}`

    setThumbnailUrls([
      { url: firstThumbnailUrl, label: 'Thumbnail 1 (25x25)' },
      { url: secondThumbnailUrl, label: 'Thumbnail 2 (1000x1000)' }
    ])
  }

  const handleInputChange = (e) => {
    setInputUrl(e.target.value)
  }

  const handleGenerateClick = () => {
    generateThumbnailUrls(inputUrl)
  }

  return (
    <div className="max-w-screen-sm mx-auto bg-white flex gap-8 flex-col mt-16 p-4">
      <h1 className="font-semibold">Cloudinary Thumbnail Generator</h1>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Enter Cloudinary video URL"
          value={inputUrl}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md grow px-4 py-2"
        />
        <Button onClick={handleGenerateClick} className="w-16 h-auto">
          Generate Thumbnails
        </Button>
      </div>
      {thumbnailUrls.length > 0 && (
        <div className="w-full flex flex-col gap-4">
          <h2 className="font-semibold">Generated Thumbnail URLs</h2>
          <ul className="space-y-4">
            {thumbnailUrls.map((item, index) => (
              <li key={index} className="overflow-x-auto">
                <div className="inline-block">
                  <p className="font-medium">{item.label}</p>
                  <a
                    className="text-blue-500 underline whitespace-nowrap"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.url}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
