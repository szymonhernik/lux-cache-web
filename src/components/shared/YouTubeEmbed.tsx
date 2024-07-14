export default function YouTubeEmbed({ url }: { url: string }) {
  // Extract the video ID from the YouTube URL
  const videoId = url.split('v=')[1]
  const embedUrl = `https://www.youtube.com/embed/${videoId}`

  return (
    <div className="youtube-embed py-4 ">
      <iframe
        // width={'100%'}
        className="aspect-video w-3/4 mx-auto"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  )
}
