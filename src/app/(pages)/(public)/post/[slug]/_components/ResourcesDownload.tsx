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

  console.log('downloadFiles', downloadFiles)

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-fit ">Downloads</Button>
      </DialogTrigger>
      <DialogContent className="w-11/12  bg-neutral-300 rounded-none sm:rounded-none max-w-3xl ">
        <DialogHeader className="sm:text-center gap-16 py-16">
          <DialogTitle className="mx-auto font-normal text-base">
            Downloads
          </DialogTitle>
          <DialogDescription className="mx-auto w-full  max-w-96 font-semibold text-primary-foreground text-base">
            {downloadFiles && downloadFiles.length > 0
              ? downloadFiles.map((file) => {
                  if (file.fileForDownload?.asset?.url) {
                    return (
                      <div
                        key={file._key}
                        className="border rounded-md border-black w-full p-8   "
                      >
                        <a
                          href={file.fileForDownload.asset.url}
                          download
                          className="flex gap-2 justify-between"
                        >
                          <div>
                            {file.fileForDownload.asset.originalFilename} (
                            {convertBytesToMB(file.fileForDownload.asset.size)})
                          </div>{' '}
                          <div className="flex items-center ">
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
