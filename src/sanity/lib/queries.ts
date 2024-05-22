import { groq } from 'next-sanity'

export const postsQuery = groq`{
  "posts": *[_type == "post" && defined(slug)] | order(publishedAt desc) {
    _id, 
    title, 
    artistList,
    publishedAt, 
    "slug": slug.current,
    coverImage,
    coverVideo,
    filters,
    minimumTier,
    ogDescription,
  }
}`

export const initialPostsQuery = groq`{
  "initialPosts": *[_type == "post"] | order(publishedAt desc) [0...8] {
    _id, 
    title, 
    artistList,
    publishedAt, 
    "slug": slug.current,
    coverImage,
    coverVideo,
    filters,
    minimumTier,
    ogDescription,
  }
}`
// export const postsQuery = groq`{
//   "posts": *[_type == "post"] | order(publishedAt desc) [0...10] {
//     _id, title, publishedAt
//   }
// }`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id, 
    title, 
    artistList,
    publishedAt, 
    "slug": slug.current,
    coverImage,
    coverVideo,
    filters,
    minimumTier,
    ogDescription,
  }
`

export const settingsQuery = groq`
  *[_type == "settings"][0]{
    ogImage
  }
`
