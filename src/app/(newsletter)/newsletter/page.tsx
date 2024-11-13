import { Suspense } from 'react'
import MailJet from './_components/MailJet'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MailJet />
    </Suspense>
  )
}
