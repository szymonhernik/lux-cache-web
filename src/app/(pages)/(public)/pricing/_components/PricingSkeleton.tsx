import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/shadcn/ui/card'
import { Skeleton } from '@/components/shadcn/ui/skeleton'

export default function PricingSkeleton() {
  return (
    <>
      <h1 className="text-shadow text-sm font-semibold lg:sticky lg:top-0 p-4 lg:p-6 uppercase">
        pricing
      </h1>
      <section>
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <h1 className="text-xl font-extrabold  sm:text-center ">
              Choose your subscription
            </h1>
            <div className="relative self-center mt-10 ">
              <Skeleton className="h-8 w-32 " />
            </div>
          </div>
          <div className="mt-10 space-y-4 sm:mt-16 sm:space-y-0 flex flex-wrap justify-center gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
            {[...Array(3)].map((_, index) => (
              <Card className="w-[320px] bg-primary border-none space-y-6 py-6 shadow-sm">
                <CardHeader className="">
                  <Skeleton className="h-8 w-3/4 mx-auto pb-0" />
                </CardHeader>
                <CardContent className="space-y-8">
                  <Skeleton className=" h-12 w-full" />
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
