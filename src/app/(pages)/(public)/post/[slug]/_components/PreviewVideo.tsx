'use client'

import { useRef, useState } from 'react'

interface Props {
  isDesktop: boolean
  isTouchDevice: boolean
  isHovered?: boolean
  fullyInView?: boolean | undefined
  isTouched?: boolean
  previewVideo: {
    video: {
      _key: null
      _type: 'cloudinary.asset'
      format: string | null
      public_id: string | null
    } | null
  }
}
export default function PreviewVideo(props: Props) {
  const {
    previewVideo,
    isTouched,
    fullyInView,
    isDesktop,
    isHovered,
    isTouchDevice
  } = props

  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const video = previewVideo?.video

  const handleVideoLoad = () => {
    setIsVideoLoaded(true)
  }

  // useEffect(() => {
  //   if (isTouchDevice) {
  //     if (fullyInView == true) {
  //       if (isTouched || isHovered) {
  //         videoRef.current?.play()
  //       } else {
  //         videoRef.current?.pause()
  //       }
  //     } else {
  //       videoRef.current?.pause()
  //     }
  //   }
  // }, [fullyInView])

  if (video && video.public_id && video.format) {
    return (
      <>
        <video
          ref={videoRef}
          className={`h-full w-full min-w-screen lg:min-w-auto ${!isVideoLoaded ? 'hidden' : ''}`}
          playsInline
          muted
          loop
          // autoPlay={!isTouchDevice ? true : false}
          autoPlay
          // autoPlay
          onLoadedData={handleVideoLoad}
        >
          <source
            src={`https://cloud-lc.b-cdn.net/video/upload/w_500/q_80/f_webm/${video.public_id}.webm`}
            type="video/webm"
          />
          <source
            src={`https://cloud-lc.b-cdn.net/video/upload/w_500/q_80/f_mp4/${video.public_id}.mp4`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </>
    )
  }
}
