'use client'

interface Props {
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
  const { previewVideo } = props

  const video = previewVideo?.video

  if (video && video.public_id && video.format) {
    return (
      <>
        <video
          className="h-full w-full"
          playsInline
          autoPlay
          muted
          loop
          src={`https://cloud-lc.b-cdn.net/video/upload/w_960/q_auto/f_auto/${video.public_id}.${video.format}`}
        ></video>
      </>
    )
  }
}
// https://stream.mux.com/abcd1234/capped-1080p.mp4
// https://stream.mux.com/lRE02tg8pyThyQnKsI02qp81bBlzgtLCRwVCUThlj5l7E
