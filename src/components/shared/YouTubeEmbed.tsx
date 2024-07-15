'use client'
import YouTubePlayer from 'react-player/youtube'

export default function YouTubeEmbed({ url }: { url: string }) {
  return (
    <div className="youtube-embed py-4 text-center w-full mx-auto max-w-screen-sm aspect-[4/3]">
      {typeof url === 'string' ? (
        <YouTubePlayer
          controls={true}
          url={url}
          width={'100%'}
          height={'100%'}
          // style={{ margin: '0 auto', width: 'fit-content;' }}
        />
      ) : null}
    </div>
  )
}
