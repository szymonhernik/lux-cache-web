import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents
} from 'next-sanity'
import type { Image } from 'sanity'

import ImageBoxArticle from './ImageBoxArticle'
import { TimelineSection } from './TimelineSection'
import YouTubeEmbed from './YouTubeEmbed'
import { suisse } from '@/app/layout'

export function CustomPortableText({
  paragraphClasses,
  value
}: {
  paragraphClasses?: string
  value: PortableTextBlock[]
}) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => {
        return <p className={paragraphClasses}>{children}</p>
      },
      h1: ({ children }) => (
        <h1 className="pt-8 pb-2 text-3xl font-semibold ">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="pt-8 pb-2 text-2xl font-semibold ">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="pt-8 pb-2 text-xl font-semibold ">{children}</h3>
      ),
      h4: ({ children }) => (
        <h4 className="pt-8 pb-2 text-lg font-semibold ">{children}</h4>
      ),
      h5: ({ children }) => (
        <h5 className="pt-8 pb-2 text-base font-semibold ">{children}</h5>
      )
      //   blockquote: ({ children }) => (
      //     <blockquote className="italic border-l-4 border-gray-300 pl-4">
      //       {children}
      //     </blockquote>
      //   )
    },
    // list: ({ children, value }) =>

    //   value === 'bullet' ? (
    //     <ul className="something">{children}</ul>
    //   ) : value === 'number' ? (
    //     <ol className="list-decimal">{children}</ol>
    //   ) : (
    //     <ul>{children}</ul>
    //   ),
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc list-inside py-4 ml-4">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal list-inside py-4 ml-4">{children}</ol>
      )
    },
    listItem: {
      bullet: ({ children }) => <li className="mb-2">{children}</li>,
      number: ({ children }) => <li className="mb-2">{children}</li>
    },
    marks: {
      link: ({ children, value }) => {
        return (
          <a
            className="underline transition hover:opacity-50"
            href={value?.href}
            rel="noreferrer noopener"
          >
            {children}
          </a>
        )
      }
    },
    types: {
      introText: ({ value }) => {
        // Assuming value.body contains the content for introText
        return (
          <div className="intro-text">
            <PortableText value={value.body} />
          </div>
        )
      },
      imageInline: ({ value }) => {
        const { alt, caption, size } = value
        let sizeClass = ''
        switch (size) {
          case 'small':
            sizeClass = 'w-full md:w-1/3'
            break
          case 'medium':
            sizeClass = 'w-full md:w-2/3'
            break
          case 'wide':
            sizeClass = 'w-full md:w-full'
            break
          default:
            sizeClass = 'w-full md:w-1/2'
        }
        return (
          <div className={`py-6 space-y-2 mx-auto text-center`}>
            <ImageBoxArticle
              image={value}
              alt={alt}
              classesWrapper={`relative mx-auto ${sizeClass}`}
            />
            {caption && <div className="text-sm text-gray-600">{caption}</div>}
          </div>
        )
      },
      //   audioInline: ({ value }) => <AudioEmbed src={value.url} />,
      //   video: ({ value }) => <VideoEmbed src={value.url} />,
      youtube: ({ value }) => <YouTubeEmbed url={value.url} />,
      //   spotify: ({ value }) => <SpotifyEmbed url={value.url} />,
      timeline: ({ value }) => {
        const { items } = value || {}
        return <TimelineSection timelines={items} />
      },
      postContent: ({ value }) => {
        return (
          <div className="post-content space-y-2">
            <PortableText value={value.body} components={components} />
          </div>
        )
      },
      postFooter: ({ value }) => {
        return (
          <div className="post-footer">
            <PortableText value={value.body} />
          </div>
        )
      },
      image: ({
        value
      }: {
        value: Image & { alt?: string; caption?: string }
      }) => {
        return (
          <div className="my-6 space-y-2">
            <ImageBoxArticle
              image={value}
              alt={value.alt}
              classesWrapper="relative aspect-[16/9]"
            />
            {value?.caption && (
              <div className="font-sans text-sm text-gray-600">
                {value.caption}
              </div>
            )}
          </div>
        )
      }
    }
  }

  return <PortableText components={components} value={value} />
}
