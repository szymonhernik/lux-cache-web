import { Badge } from '@/components/shadcn/ui/badge'
import { TooltipContent } from '@/components/shadcn/ui/tooltip'
import { Tooltip, TooltipTrigger } from '@/components/shadcn/ui/tooltip'
import { TooltipProvider } from '@/components/shadcn/ui/tooltip'
import { FaceIcon, RocketIcon } from '@radix-ui/react-icons'
import { Shield, User, Users } from 'lucide-react'
import { headers } from 'next/headers'

type Role = 'admin' | 'contributor'
interface RoleInfo {
  icon: React.ElementType
  description: string
}

const roleInfoMap: Record<Role, RoleInfo> = {
  admin: {
    icon: Shield,
    // color: 'text-red-500 dark:text-red-400',
    description:
      'Everything plus can assign collaborators roles via Admin panel.'
  },
  contributor: {
    icon: Users,
    // color: 'text-blue-500 dark:text-blue-400',
    description: 'Full access to all features, settings, and content'
  }
  // mooderator: {
  //   icon: User,
  //   color: "text-gray-500 dark:text-gray-400",
  //   description: "Can view content but cannot make changes",
  // },
}

export default async function RoleBadge({ userRoles }: { userRoles: string }) {
  return (
    <TooltipProvider>
      <div className="fixed top-4 left-4 z-50 flex gap-2 bg-primary dark:bg-gray-800 rounded-full hover:shadow-md transition-shadow duration-200 p-1">
        {userRoles.split(',').map((role) => {
          const { icon: Icon, description } = roleInfoMap[role as Role]
          return (
            <Tooltip key={role}>
              <TooltipTrigger asChild>
                <div
                  className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-help`}
                >
                  <Icon className={`w-4 h-4 `} />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                sideOffset={10}
                className="ml-2 max-w-xs"
              >
                <p>
                  <span className="font-semibold">
                    {role.charAt(0).toUpperCase() + role.slice(1)}:
                  </span>{' '}
                  {description}
                </p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
