import { Suspense } from 'react'
import MailJet from './_components/MailJet'
import { SpinnerContainer } from '@/components/shared/SpinnerContainer'

export default function Page() {
  return (
    <Suspense fallback={<SpinnerContainer />}>
      <MailJet />
    </Suspense>
  )
}
