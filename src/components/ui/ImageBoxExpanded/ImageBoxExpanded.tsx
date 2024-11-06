import React from 'react'

import Image from 'next/image'

interface ImageExpanded {
  asset: {
    _id: string
    url: string | null
    lqip: string | null
  } | null
  _type: 'image'
}

interface Props {
  image?: ImageExpanded
  alt?: string
  width?: number
  height?: number
  size?: string
  classesWrapper?: string
  'data-sanity'?: string
}
const ImageBoxExpanded = ({
  image,
  alt = 'Cover image',
  width = 600,
  height = 300,
  size = '100vw',
  classesWrapper,
  ...props
}: Props) => {
  // const imageUrl =
  //   // @ts-ignore
  //   image && urlForImage(image)?.height(height).width(width).fit('crop').url()

  const imageUrl =
    image?.asset?.url && `${image.asset.url}?w=${width}&h=${height}`

  const imageProps = {} as { blurDataURL?: string; placeholder: any }
  if (image?.asset?.lqip) {
    imageProps.blurDataURL = image.asset.lqip
    imageProps.placeholder = 'blur'
  }

  return (
    <div
      className={`w-full overflow-hidden  bg-black ${classesWrapper}`}
      data-sanity={props['data-sanity']}
    >
      {imageUrl && (
        <div>
          <Image
            className="absolute h-full w-full object-cover"
            alt={alt}
            width={width}
            height={height}
            sizes={size}
            src={imageUrl}
            {...imageProps}
          />
        </div>
      )}
    </div>
  )
}

export default ImageBoxExpanded
