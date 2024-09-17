'use client'

import DownloadIcon from '@/components/icons/DownloadIcon'
import { Button } from '@/components/shadcn/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogTitle
} from '@/components/shadcn/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/shadcn/ui/tooltip'

type PropsType = {
  downloadFiles:
    | {
        fileTitle?: string
        fileForDownload: {
          asset: {
            url: string | null
            size: number | null
            originalFilename: string | null
            _id: string
          } | null
        } | null
        _type: 'fileAsset'
        _key: string
      }[]
    | null
    | undefined
}
export default function ResourcesDownload(props: PropsType) {
  const { downloadFiles } = props

  const convertBytesToMB = (sizeInBytes: number | null): string => {
    if (sizeInBytes === null) return 'N/A'
    const sizeInMB = sizeInBytes / (1024 * 1024)
    return sizeInMB.toFixed(2) + ' MB'
  }
  const replaceUrl = (url: string) => {
    const originalUrl = 'https://cdn.sanity.io/'
    const newUrl = 'https://cloud-lc-files.b-cdn.net/'
    return url.replace(originalUrl, newUrl)
  }
  // console.log(downloadFiles)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit ">
          Downloads ({downloadFiles ? downloadFiles.length : 0})
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12  bg-neutral-300 rounded-none sm:rounded-none max-w-3xl  ">
        <DialogHeader className="sm:text-center gap-16 py-16 overflow-x-auto">
          <DialogTitle className="mx-auto font-normal text-base">
            Downloads
          </DialogTitle>
          <DialogDescription className="mx-auto w-full max-w-md font-semibold text-primary-foreground text-base">
            {downloadFiles && downloadFiles.length > 0
              ? downloadFiles.map((file) => {
                  if (file.fileForDownload?.asset?.url) {
                    return (
                      <div
                        key={file._key}
                        className="border rounded-md border-black w-full p-8"
                      >
                        <a
                          href={replaceUrl(file.fileForDownload.asset.url)}
                          // href={file.fileForDownload.asset.url}
                          download
                          className="flex gap-2 justify-between items-center "
                        >
                          <div className="flex-1 min-w-0">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="truncate">
                                    {
                                      file.fileForDownload.asset
                                        .originalFilename
                                    }
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {
                                      file.fileForDownload.asset
                                        .originalFilename
                                    }
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <div className="text-sm text-gray-600">
                              (
                              {convertBytesToMB(
                                file.fileForDownload.asset.size
                              )}
                              )
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <DownloadIcon />
                          </div>
                        </a>
                      </div>
                    )
                  }
                })
              : 'No downloads available'}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
