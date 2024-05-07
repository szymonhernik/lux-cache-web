import { groq } from 'next-sanity'

export const postsQuery = groq`{
  "posts": *[_type == "post" && defined(slug)]
}`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _createdAt,
    _id,
    title,
    "slug": slug.current,
    filters,
    "artists": artist[]->{
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
