import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/shadcn/ui/breadcrumb'

import { PostsByArtistSlugQueryResult } from '@/utils/types/sanity/sanity.types'

type TypePathnames = {
  name: string
  path?: string
}[]
type Props = {
  pathnames: TypePathnames
}

export default function Breadcrumbs(props: Props) {
  const { pathnames } = props
  return (
    <div className="p-4 ">
      <Breadcrumb>
        <BreadcrumbList>
          {/* <BreadcrumbItem>
                    <BreadcrumbLink href="/browse">Browse</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>Artists</BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Nkisi Mavinga</BreadcrumbPage>
                </BreadcrumbItem> */}
          {pathnames &&
            pathnames.map((pathname, index) => (
              <BreadcrumbItem key={index}>
                {pathname.path ? (
                  <BreadcrumbLink href={pathname.path}>
                    {pathname.name}
                  </BreadcrumbLink>
                ) : index !== pathnames.length - 1 ? (
                  <>{pathname.name}</>
                ) : (
                  index === pathnames.length - 1 && (
                    <BreadcrumbPage>{pathname.name}</BreadcrumbPage>
                  )
                )}
                {index < pathnames.length - 1 && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
