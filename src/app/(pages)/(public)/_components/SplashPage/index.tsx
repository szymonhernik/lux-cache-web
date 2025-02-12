import SplashVideoStream from './SplashVideoStream'
import TrialForm from './TrialForm'

export default function SplashVideo() {
  return (
    <div className="relative h-[calc(100vh-4rem)] lg:h-screen w-full">
      <SplashVideoStream />

      <div className="absolute bottom-10 right-10 space-y-4 max-w-md w-full p-4 bg-slate-300 bg-opacity-20 backdrop-contrast-[50] backdrop-blur-sm rounded-lg ">
        <h1 className="text-black text-2xl uppercase italic">
          Try 7 days for free
        </h1>
        <TrialForm />
        <p className="text-xs text-primary-foreground ">
          By clicking 'Continue' you are indicating that you have read and agree
          to the Terms of Service and Privacy.
        </p>
      </div>
    </div>
  )
}
