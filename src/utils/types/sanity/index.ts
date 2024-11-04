import type { Image, PortableTextBlock } from 'sanity'
import {
  InitialPostsQueryResult,
  PostBySlugQueryResult,
  PostsQueryResult,
  SanityImageCrop,
  SanityImageHotspot,
  internalGroqTypeReferenceTo
} from './sanity.types'

export interface MenuItem {
  _type: string
  slug?: string
  title?: string
}

export interface MilestoneItem {
  description?: string
  duration?: {
    start?: string
    end?: string
  }
  image?: Image
  tags?: string[]
  title?: string
}

export interface ShowcaseProject {
  _type: string
  coverImage?: Image
  overview?: PortableTextBlock[]
  slug?: string
  tags?: string[]
  title?: string
}

// Page payloads

export interface HomePagePayload {
  footer?: PortableTextBlock[]
  overview?: PortableTextBlock[]
  showcaseProjects?: ShowcaseProject[]
  title?: string
}

export interface PagePayload {
  body?: PortableTextBlock[]
  name?: string
  overview?: PortableTextBlock[]
  title?: string
  slug?: string
}

export interface PostsPayload {
  posts?: PostPayload[]
}

export interface PostPayload {
  title: string
  slug: {
    current: string
  }
  body: PortableTextBlock[]
  _id: string
  // TODO: Define artist type
  artists: Array<any>
  // TODO: Define filters type
  filters: Array<any>
  publishedAt: string
}

export interface ProjectPayload {
  client?: string
  coverImage?: Image
  description?: PortableTextBlock[]
  duration?: {
    start?: string
    end?: string
  }
  overview?: PortableTextBlock[]
  site?: string
  slug: string
  tags?: string[]
  title?: string
}

export interface SettingsPayload {
  footer?: PortableTextBlock[]
  menuItems?: MenuItem[]
  ogImage?: Image
}

export type SinglePostType = InitialPostsQueryResult['posts'][number]

export interface ImageType {
  asset?:
    | {
        _ref: string
        _type: 'reference'
        _weak?: boolean | undefined
        [internalGroqTypeReferenceTo]?: 'sanity.imageAsset' | undefined
      }
    | undefined
  hotspot?: SanityImageHotspot | undefined
  crop?: SanityImageCrop | undefined
  alt?: string | undefined
  _type: 'image'
}

export interface PreviewVideoType {
  generatedBase64: null
  video: {
    _key: null
    _type: 'cloudinary.asset'
    format: string | null
    public_id: string | null
  } | null
}

export type UpdatedPostBySlugQueryResult = Omit<
  PostBySlugQueryResult,
  'pageContent'
> & {
  pageContent: PortableTextBlock[] | null
}

// export type PageContent = PostBySlugQueryResult['title']
// Conditional type to extract the 'title' type
// type TitleType = PostBySlugQueryResult extends { title: infer T } ? T : never
type TitleType = NonNullable<PostBySlugQueryResult>['title']
export type PageContent = NonNullable<PostBySlugQueryResult>['pageContent']
