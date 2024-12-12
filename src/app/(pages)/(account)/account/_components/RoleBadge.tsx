import { Badge } from '@/components/shadcn/ui/badge'
import { FaceIcon, RocketIcon } from '@radix-ui/react-icons'
import { headers } from 'next/headers'

export default async function RoleBadge({ userRole }: { userRole: string }) {
  return (
    <div className="fixed top-8 left-6">
      <Badge
        variant={'outline'}
        className="flex items-center gap-1 border-fuchsia-200 bg-fuchsia-100 "
      >
        <FaceIcon />

        {userRole}
      </Badge>
    </div>
  )
}
