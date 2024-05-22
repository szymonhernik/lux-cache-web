import { numberOfItemsPerPage } from '@/utils/fetch-helpers'
import { groq } from 'next-sanity'

export const postsQuery = groq`{
  "posts": *[_type == "post" && defined(slug)] | order(publishedAt desc) {
    _id, title, publishedAt, "slug": slug.current,
  }
}`

export const initialPostsQuery = groq`{
  "initialPosts": *[_type == "post"] | order(publishedAt desc) [0...${numberOfItemsPerPage as number}] {
    _id, title, publishedAt, 
    "slug": slug.current,
  }
}`
// export const postsQuery = groq`{
//   "posts": *[_type == "post"] | order(publishedAt desc) [0...10] {
//     _id, title, publishedAt
//   }
// }`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _createdAt,
    _id,
    title,
    "slug": slug.current,
    filters,
    "artists": artist[]->{
      _key,
      name,
      slug
    },
    publishedAt,
    body,
  }
`

export const settingsQuery = groq`
  *[_type == "settings"][0]{
    ogImage
  }
`
