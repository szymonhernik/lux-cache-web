import { Suspense } from 'react'
import MailJet from './_components/MailJet'
import { SpinnerContainer } from '@/components/shared/SpinnerContainer'

export default function Page() {
  return (
    <Suspense fallback={<SpinnerContainer />}>
      {/* <MailJet /> */}
      <div className="h-screen w-auto mx-auto  items-center justify-center flex flex-col gap-12 px-4">
        <div className="mx-auto text-center">
          <p className="text-sm ">
            Under construction, please check back later.
          </p>
        </div>
      </div>
    </Suspense>
  )
}
