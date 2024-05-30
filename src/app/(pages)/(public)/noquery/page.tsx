import { Button } from '@/components/shadcn/ui/button'
import Link from 'next/link'

export default function Page() {
  return (
    <>
      <p>No query page</p>
      <Button variant={'outline'}>
        <Link href={'/'}>Back to home (query route)</Link>
      </Button>
    </>
  )
}
