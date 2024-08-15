import MuxPlayer from '@mux/mux-player-react'

export default function VideoMuxInline({ value }: { value: any }) {
  return (
    <>
      {value.videoFile.asset.playback && (
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
