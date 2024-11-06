import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/shadcn/ui/breadcrumb'


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
    <div className=" text-shadow uppercase ">
      <Breadcrumb>
        <BreadcrumbList>
          {pathnames &&
            pathnames.map((pathname, index) => (
              <>
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
                </BreadcrumbItem>
                {index < pathnames.length - 1 && <BreadcrumbSeparator />}
              </>
            ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
