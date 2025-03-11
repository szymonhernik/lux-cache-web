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

  const replaceUrl = (
    url: string,
    size: number | null,
    filename: string
  ): string => {
    try {
      const originalUrl = 'https://cdn.sanity.io/'
      const regularPullZone = 'https://cloud-lc-files.b-cdn.net/'
      const largePullZone = 'https://cloud-lc-large-files.b-cdn.net/'

      // Determine which pull zone to use based on file size
      const newUrl =
        size && size > 10 * 1024 * 1024 ? largePullZone : regularPullZone

      // Extract the path from the original URL
      const path = new URL(url).pathname
      // Construct the new URL with the appropriate Bunny CDN domain, path, and download parameter
      const basePath = `${newUrl}${path.startsWith('/') ? path.slice(1) : path}`

      // Only add ?dl= parameter if filename exists and is not empty
      if (filename && filename.trim() !== '') {
        return `${basePath}?dl=${encodeURIComponent(filename)}`
      }

      return basePath
    } catch (error) {
      console.error('Error replacing URL:', error)
      return url // Return the original URL if there's an error
    }
  }

  const handleDownload = (
    url: string,
    filename: string,
    size: number | null
  ) => {
    const bunnyCdnUrl = replaceUrl(url, size, filename)
    // console.log('Downloading from:', bunnyCdnUrl)

    // Create a fetch request instead of using an anchor tag
    fetch(bunnyCdnUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a blob URL and use it for download
        const blobUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()

        // Clean up
        document.body.removeChild(link)
        URL.revokeObjectURL(blobUrl)
      })
      .catch((error) => {
        console.error('Error downloading file:', error)
        // Fallback to the original method if fetch fails
        const link = document.createElement('a')
        link.href = bunnyCdnUrl
        link.download = filename
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
  }

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
          <DialogDescription className="mx-auto w-full max-w-md font-semibold text-primary-foreground text-base space-y-4">
            {downloadFiles && downloadFiles.length > 0
              ? downloadFiles.map((file) => {
                  const assetUrl = file.fileForDownload?.asset?.url
                  const assetSize = file.fileForDownload?.asset?.size
                  const assetFilename =
                    file.fileForDownload?.asset?.originalFilename ??
                    file.fileTitle ??
                    'download'

                  if (assetUrl && assetSize !== undefined && assetFilename) {
                    return (
                      <div
                        key={file._key}
                        className="border rounded-md border-black w-full p-8"
                      >
                        <div
                          onClick={() =>
                            handleDownload(assetUrl, assetFilename, assetSize)
                          }
                          className="flex gap-2 justify-between items-center cursor-pointer"
                        >
                          <div className="flex-1 min-w-0">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="truncate">
                                    {assetFilename}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{assetFilename}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <div className="text-sm text-gray-600">
                              ({convertBytesToMB(assetSize)})
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <DownloadIcon />
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                })
              : 'No downloads available'}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
