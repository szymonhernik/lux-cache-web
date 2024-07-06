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
export default function VideoThroughCDNTest(props: Props) {
  const { previewVideo } = props

  const generatedBase64 = previewVideo?.generatedBase64
  const video = previewVideo?.video

  return (
    <div>
      <div className="h-96 w-96 overflow-hidden relative">
        {video && video.public_id && video.format && generatedBase64 && (
          <>
            <img
              src={generatedBase64}
              className="h-full w-full blur-[32px] scale-150  z-[-1] object-cover absolute top-0 right-0 bottom-0 left-0"
            />
            <video
              className="h-full w-full"
              playsInline
              autoPlay
              muted
              loop
              src={`https://lc-1.b-cdn.net/dmowkzh44/video/upload/w_960/q_auto/f_auto/${video.public_id}.${video.format}`}
            ></video>
          </>
        )}
      </div>
    </div>
  )
}
// https://stream.mux.com/abcd1234/capped-1080p.mp4
// https://stream.mux.com/lRE02tg8pyThyQnKsI02qp81bBlzgtLCRwVCUThlj5l7E
