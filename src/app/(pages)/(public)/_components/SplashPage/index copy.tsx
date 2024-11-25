import TrialForm from './TrialForm'

export default function SplashVideo() {
  return (
    <div className="relative h-[calc(100vh-4rem)] lg:h-screen w-full">
      <VideoSplashPage />
      <div className="absolute top-0 left-0  h-screen space-y-4 w-full p-4 bg-slate-300 bg-opacity-20 backdrop-contrast-[100] backdrop-blur-sm rounded-lg">
        <div className=" absolute bottom-10 h-32 left-10 sm:left-auto right-10 max-w-md w-full flex flex-col gap-4">
          <h1 className="text-black text-2xl uppercase italic">
            Try 7 days for free
          </h1>
          <TrialForm />
          <p className="text-xs text-primary-foreground">
            By clicking 'Continue' you are indicating that you have read and
            agree to the Terms of Service and Privacy.
          </p>
        </div>
      </div>
    </div>
  )
}

function VideoSplashPage() {
  const r2Url = `https://pub-e18f0b6cf12246908bb3d80c99e28ea9.r2.dev`
  function configureURL(fileName: string) {
    return `${r2Url}/${fileName}`
  }
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover"
    >
      {/* Desktop */}
      <source
        src={configureURL('desktop_h265.mp4')}
        type="video/mp4; codecs=hevc"
        media="(min-width: 1200px)"
      />
      <source
        src={configureURL('desktop_h264.mp4')}
        type="video/mp4"
        media="(min-width: 1200px)"
      />
      {/* Tablet */}
      <source
        src={configureURL('tablet_h265.mp4')}
        type="video/mp4; codecs=hevc"
        media="(min-width: 768px)"
      />
      <source
        src={configureURL('tablet_h264.mp4')}
        type="video/mp4"
        media="(min-width: 768px)"
      />
      {/* Mobile */}
      <source
        src={configureURL('mobile_h265.mp4')}
        type="video/mp4; codecs=hevc"
        media="(max-width: 768px)"
      />
      <source
        src={configureURL('mobile_h264.mp4')}
        type="video/mp4"
        media="(max-width: 768px)"
      />
      Your browser does not support the video tag.
    </video>
  )
}
