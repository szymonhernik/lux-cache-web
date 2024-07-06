'use client'

interface Props {
  previewVideo: {
    generatedBase64: string | null
    video: {
      _key: null
      _type: 'cloudinary.asset'
      format: string | null
      public_id: string | null
    } | null
  }
}
export default function PreviewVideo(props: Props) {
  const { previewVideo } = props

  const video = previewVideo?.video

  if (video && video.public_id && video.format) {
    return (
      <>
        {/* <img
          src={generatedBase64}
          className="h-full w-full blur-[32px] scale-150  z-[-1] object-cover absolute top-0 right-0 bottom-0 left-0"
        /> */}
        <video
          className="h-full w-full"
          playsInline
          autoPlay
          muted
          loop
          src={`https://lc-1.b-cdn.net/dmowkzh44/video/upload/w_960/q_auto/f_auto/${video.public_id}.${video.format}`}
        ></video>
      </>
    )
  }
}
// https://stream.mux.com/abcd1234/capped-1080p.mp4
// https://stream.mux.com/lRE02tg8pyThyQnKsI02qp81bBlzgtLCRwVCUThlj5l7E
