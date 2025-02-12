import SplashVideoStream from './SplashVideoStream'
import TrialForm from './TrialForm'

export default function SplashVideo() {
  return (
    <div className="relative h-[calc(100vh-4rem)] lg:h-screen w-full">
      <SplashVideoStream />

      <div className="left-0 absolute z-[3] bottom-10 md:left-auto md:right-10 right-0 p-4 md:max-w-md w-full   rounded-lg ">
        <div className="space-y-4 bg-slate-300 bg-opacity-20 backdrop-contrast-[50] backdrop-blur-sm rounded-lg p-4">
          <h1 className="text-black text-2xl uppercase italic">
            Try 7 days for free
          </h1>
          <TrialForm />
          <p className="text-xs text-primary-foreground ">
            By clicking 'Continue' you are indicating that you have read and
            agree to the Terms of Service and Privacy.
          </p>
        </div>
      </div>
    </div>
  )
}
