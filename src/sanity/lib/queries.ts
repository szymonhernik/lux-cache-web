import { groq } from 'next-sanity'

const postQueryFields = `
    _id, 
    title, 
    artistList,
    publishedAt, 
    "slug": slug.current,
    coverImage{
      asset->{url}
    },
    coverVideo,
    minimumTier,
    ogDescription,
    filters[]->{
      "slug": slug.current
    },
  
`

export const postsQuery = groq`{
  "posts": *[_type == "post" && defined(slug)] | order(publishedAt desc) {
    ${postQueryFields}
  }
}`

export const initialPostsQuery = groq`{
  "posts": *[_type == "post" && defined(slug)] | order(publishedAt desc) [0...8] {
    ${postQueryFields}
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
    ${postQueryFields}
  }
}`

export const searchQuery = groq`
  {
    "artists": *[_type == "artist" && name match $searchValue + "*"]{
      _id,
      name,
      "slug": slug.current,
    },
    "posts": *[_type == "post" && title match $searchValue + "*"]{
      _id,
      title,
      publishedAt,
      "slug": slug.current,
      ogDescription,
      filters[]->{
        "slug": slug.current,
        title
      },
    },
    "series": *[_type== "series" && title match $searchValue + "*"]{
      _id,
      title,
      "slug": slug.current,
    },
    "hiddenTags": *[_type == 'post' && hiddenTags match $searchValue + "*"]{
      _id,
      title,
      "slug": slug.current,
    }
    // "series":  *[_type == "post" && series[]->title match $searchValue + "*"] {
    //   _id,
    //   title,
    //   "slug": slug.current,
    // },
    
    
  }
`

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
