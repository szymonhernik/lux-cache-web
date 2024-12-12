import { Badge } from '@/components/shadcn/ui/badge'
import { FaceIcon, RocketIcon } from '@radix-ui/react-icons'
import { headers } from 'next/headers'

export default async function RoleBadge({ userRole }: { userRole: string }) {
  return (
    <div className="fixed right-4 top-20 lg:top-4 lg:left-6 lg:right-auto">
      <Badge
        variant={'outline'}
        className="flex items-center gap-1 bg-primary "
      >
        <FaceIcon />

        {userRole}
      </Badge>
    </div>
  )
}
