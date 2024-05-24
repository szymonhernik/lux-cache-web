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
  "initialPosts": *[
    _type == "post" &&  
    (!defined($selectedFiltersArray) || $selectedFiltersArray == [] || 
      count(
        (filters[]->slug.current)[@ in $selectedFiltersArray]) == count($selectedFiltersArray)
      )
    ] | order(publishedAt desc) [0...8] {
    _id, 
    title, 
    artistList,
    publishedAt, 
    "slug": slug.current,
    coverImage,
    coverVideo,
    filters[]->{
      "slug": slug.current
    },
    minimumTier,
    ogDescription,
  }
}`

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
