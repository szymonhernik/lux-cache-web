import { groq } from 'next-sanity'

export const postsQuery = groq`{
  "posts": *[_type == "post" && defined(slug)]
}`
// export const postsQuery = groq`{
//   "posts": *[_type == "post"] | order(publishedAt desc) [0...10] {
//     _id, title, publishedAt
//   }
// }`

export const initialPostsQuery = groq`*[_type == "post"] | order(publishedAt desc) [0...8] {
  _id, title, publishedAt
}`

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
