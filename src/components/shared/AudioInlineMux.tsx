import MuxAudio from '@mux/mux-audio-react'

export default function AudioInlineMux({ value }: { value: any }) {
  return (
    <div className="audio-embed py-4 text-center w-full mx-auto max-w-96 space-y-2">
      {/* <source src={value.url} type="audio/mpeg" /> */}
      <MuxAudio
        style={{ height: '60px', maxWidth: '100%', width: '100%' }}
        playbackId={value.audioFile?.asset.playbackId}
        streamType="on-demand"
        controls
      />
      <caption className="w-full block text-sm text-neutral-500 ">
        {value.audioLabel}{' '}
        {value.downloadUrl && (
          <a
            className={'hover:underline'}
            target={'_blank'}
            href={value.downloadUrl}
          >
            (download)
          </a>
        )}
      </caption>
    </div>
  )
}
