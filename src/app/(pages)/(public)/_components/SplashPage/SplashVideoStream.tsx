'use client'
import { useEffect, useRef, useState } from 'react'
import { Hls } from 'hls-video-element'

export default function SplashVideoStream() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHDReady, setIsHDReady] = useState(false)

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    // const videoSrc =
    //   'https://vz-f9672ffd-83a.b-cdn.net/67f3fa77-d814-481d-a947-6d037a824ccc/playlist.m3u8'
    const videoSrc =
      'https://pub-e18f0b6cf12246908bb3d80c99e28ea9.r2.dev/output/playlist.m3u8'

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
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundImage:
            "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAx0lEQVR42gXB2y4DURSA4X/tw2yjimsP78JLkIgXwANIVKOEmGjK2G2nM/uwfJ8cUlGtSlXY/CVqhVnr6fsITBhVJZfKlCvHwTHtC4uXL7wDqRVTckHEEoLj6XXN5dUNszZgnUeswwHE2JMyXN/eseqWrN4vGKcztCRkd5j04f6RxfMb8RBRge3vwHzeEhpBdmPW/mdD9/GJbY7IGbZxwFsLRpExZR33A5oTNA3r7huHpRSlasGgFRc8KoIR4fT8BOMEHwzWwD9jvm+qCtmGngAAAABJRU5ErkJggg==')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0
        }}
      />
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
