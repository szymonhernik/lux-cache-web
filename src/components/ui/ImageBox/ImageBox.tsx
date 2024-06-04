import React, { InputHTMLAttributes, ChangeEvent } from 'react'
import cn from 'classnames'

import s from './Input.module.css'
import { urlForImage } from '@/sanity/lib/utils'
import Image from 'next/image'
import { SearchQueryResult } from '@/utils/types/sanity/sanity.types'

interface Props {
  image?: SearchQueryResult['artists'][0]['image']
  alt?: string
  width?: number
  height?: number
  size?: string
  classesWrapper?: string
  'data-sanity'?: string
}
const ImageBox = ({
  image,
  alt = 'Cover image',
  width = 600,
  height = 300,
  size = '100vw',
  classesWrapper,
  ...props
}: Props) => {
  const imageUrl =
    // @ts-ignore
    image && urlForImage(image)?.height(height).width(width).fit('crop').url()

  return (
    <div
      className={`w-full overflow-hidden rounded-[3px] bg-gray-50 ${classesWrapper}`}
      data-sanity={props['data-sanity']}
    >
      {imageUrl && (
        <Image
          className="absolute h-full w-full"
          alt={alt}
          width={width}
          height={height}
          sizes={size}
          src={imageUrl}
        />
      )}
    </div>
  )
}

export default ImageBox
