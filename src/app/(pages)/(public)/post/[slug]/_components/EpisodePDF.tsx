'use client'
import { useMediaQuery } from '@/utils/hooks/use-media-query'
import s from './EpisodePDF.module.css'

type Props = {
  file: {
    asset: {
      url: string | null
      originalFilename: string | null
    } | null
    _type: 'file'
  }
}

export function EpisodePDF({ file }: Props) {
  const isTouchDevice = useMediaQuery('(hover: none) and (pointer: coarse)')

  return (
    <>
      {file.asset?.url && !isTouchDevice && (
        <div className="embed-pdf w-full">
          <div className={s.pdfWrapper}>
            <iframe
              src={`${file.asset.url}#view=FitH`}
              className="w-full aspect-[3/4] max-w-none"
            ></iframe>
          </div>
          {file.asset.originalFilename && (
            <p className="text-sm mx-auto text-center block mt-6 font-semibold text-gray-500">
              {file.asset.originalFilename}
            </p>
          )}
        </div>
      )}
    </>
  )
}
