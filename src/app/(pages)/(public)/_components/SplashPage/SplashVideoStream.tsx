'use client'
import { useEffect, useRef, useState } from 'react'
import { Hls } from 'hls-video-element'

export default function SplashVideoStream() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHDReady, setIsHDReady] = useState(false)

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const videoSrc =
      'https://vz-f9672ffd-83a.b-cdn.net/67f3fa77-d814-481d-a947-6d037a824ccc/playlist.m3u8'

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(videoSrc)
      hls.attachMedia(videoElement)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = hls.levels
        console.log('Available quality levels:', levels)

        // Force highest quality level
        hls.currentLevel = levels.length - 1

        hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
          const currentLevel = hls.levels[data.level]
          console.log('Current quality level:', currentLevel)

          videoElement.play()
          setIsHDReady(true)
        })
      })

      return () => {
        hls.destroy()
      }
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari
      videoElement.src = videoSrc
      videoElement.addEventListener('loadedmetadata', () => {
        videoElement.play()
      })
    }
  }, [])

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          top: '0',
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          opacity: isHDReady ? 1 : 0,
          transition: 'opacity 0.5s'
        }}
      />
      {!isHDReady && (
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'red',
            zIndex: 1
          }}
        />
      )}
    </>
  )
}

// export default async function SplashVideoStream() {
//   return (
//     <iframe
//       src="https://iframe.mediadelivery.net/embed/350143/67f3fa77-d814-481d-a947-6d037a824ccc?autoplay=true&loop=true&muted=true&preload=true&responsive=false&controls=false"
//       loading="lazy"
//       style={{
//         border: '0',
//         position: 'absolute',
//         top: '0',
//         height: '100%',
//         width: '100%'
//       }}
//       allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
//       allowfullscreen="true"
//     ></iframe>
//   )
// }
