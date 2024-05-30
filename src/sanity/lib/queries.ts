import { groq } from 'next-sanity'

export const postsQuery = groq`{
  "posts": *[_type == "post" && defined(slug)] | order(publishedAt desc)[0...2] {
    _id, 
    title, 
    artistList,
    publishedAt, 
    "slug": slug.current,
    coverImage{
      asset->{url}
    },
    coverVideo,
    filters,
    minimumTier,
    ogDescription,
  }
}`

export const filterGroupsQuery = groq`{
  "filterGroups": *[_type == "filterGroup"]{
    _id,
    title,
    "slug": slug.current,
    groupFilters[]->{
      _id,
      "slug":slug.current,
      title,
    }
  }
}`

export const initialPostsQuery = groq`{
  "posts": *[_type == "post" && defined(slug)] | order(publishedAt desc) [0...8] {
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
export const morePostsQuery = groq`{
  "posts": *[
    _type == "post" &&  
    ( !defined($lastPublishedAt) || (
      publishedAt < $lastPublishedAt
      || (publishedAt == $lastPublishedAt && _id < $lastId)
    )) && 
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

export const filterExample = groq`{
  "initialPosts": *[
    _type == "post" &&  
    (!defined($selectedFiltersArray) || $selectedFiltersArray == [] || 
      count(
        (filters[]->slug.current)[@ in $selectedFiltersArray]) == count($selectedFiltersArray)
      )
    ] | order(publishedAt desc) [0...$limit] {
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
