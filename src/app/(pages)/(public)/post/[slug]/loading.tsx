import { Button } from '@/components/shadcn/ui/button'
import { LoadingSpinner } from '../../../../../components/Spinner'
import { BookmarkIcon } from '@radix-ui/react-icons'

export default function Loading() {
  return (
    // <div className="my-36 max-w-2xl mx-auto divide-y grid gap-4 px-4 text-center">
    //   <LoadingSpinner className="animate-spin mx-auto" size={32} />
    // </div>
    <>
      <div className="flex items-center gap-4 p-4 sticky top-0 left-0 flex-row-reverse md:flex-row justify-between md:justify-start z-[10]">
        <div className="flex gap-2">
          <Button disabled={true}>PDF</Button>
          <Button
            variant={'outline'}
            className="flex items-center gap-1 leading-2 "
            disabled={true}
          >
            <BookmarkIcon width={16} height={16} />

            <span className="hidden md:block">Bookmark</span>
          </Button>
        </div>

        {/* <h1 className="text-shadow text-sm w-64 h-6 bg-secondary-foreground/10 rounded-sm animate-pulse font-semibold"></h1> */}
      </div>
      {/* <article className="max-w-4xl mx-auto">

        <div className=" w-full mx-auto my-36 px-4  space-y-24  ">
          <section className=" space-y-4 items-center w-full  ">
            <p className="mx-auto text-sm tracking-tight text-center w-64 h-6 bg-secondary-foreground/10 rounded-sm animate-pulse"></p>
            <div className="w-full space-y-2">
              <h1 className="mx-auto text-center text-3xl tracking-tight text-pretty font-semibold uppercase w-96 h-12 bg-secondary-foreground/10 rounded-sm animate-pulse"></h1>

              <h2 className="mx-auto text-center text-lg tracking-tight text-pretty font-semibold uppercase w-64 h-6 bg-secondary-foreground/10 rounded-sm animate-pulse"></h2>
            </div>
          </section>
        </div>
      </article> */}
      <LoadingSpinner className="my-36 animate-spin mx-auto" size={32} />
    </>
  )
}
