import MuxPlayer from '@mux/mux-player-react'

export default function VideoMuxInline({ value }: { value: any }) {
  return (
    <>
      {value.videoFile.asset.playbackId && (
        <div>
          <MuxPlayer
            playbackId={value.videoFile.asset.playbackId}
            accent-color="#000000"
          />
          {value.videoLabel && <p>{value.videoLabel}</p>}
        </div>
      )}
    </>
  )
}
