import { groq } from 'next-sanity'

const extendedAsset = `
  _id,
  url,
  "width": metadata.dimensions.width,
  "height": metadata.dimensions.height,
  "lqip": metadata.lqip,
`

const postQueryFields = `
    _id, 
    title, 
    subtitle,
    artistList[]{
    additionalContext,
    _key,
     artistRef->{
      name,
      "slug": slug.current,
     }
    },
    publishedAt, 
    "slug": slug.current,
    coverImage{
      _type,
      asset->{
        _id,
        url,
        "lqip": metadata.lqip,
      }
    },
    previewImage{
      _type,
      asset->{
        _id,
        url,
        "lqip": metadata.lqip,
      }
    },
    previewVideo {
      generatedBase64,
      video {
        _key,
        _type,
        format, 
        public_id
      }
    },
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
  "posts": *[_type == "post" && defined(slug)] | order(publishedAt desc) [0...20] {
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
    ] | order(publishedAt desc) [0...20] {
    ${postQueryFields}
  }
}`

export const searchQuery = groq`
  {
    "artists": *[_type == "artist" && name match $searchValue + "*"]{
      _id,
      name,
      "slug": slug.current,
      image,
    },
    "posts": *[_type == "post" && title match $searchValue + "*"]{
      _id,
      title,
      publishedAt,
      "slug": slug.current,
      series[]->{
        _id,
        title,
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
      publishedAt,
      series[]->{
        _id,
        title,
      },
    }
  }
`

export const filterByTagsQuery = groq`
  *[_type == "post" && count((filters[]->slug.current)[@ in $tagsSelected]) == count($tagsSelected)]{
    _id,
    filters[]->{
      "slug": slug.current
    }
  }`
export const searchQueryDefault = groq`
  {
    "artists": *[_type == "artist" && name match "*a*" ][0..0]{
      _id,
      name,
      "slug": slug.current,
      image,
    },
    "posts": *[_type == "post" && title match "*a*" ][0..0]{
      _id,
      title,
      publishedAt,
      "slug": slug.current,
      series[]->{
        _id,
        title,
      },
    },
    "series": *[_type == "series" && title match "*a*" ][0..0]{
      _id,
      title,
      "slug": slug.current,
    },
    "hiddenTags": *[_type == 'post' && hiddenTags match "*a*" ][0..0]{
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      series[]->{
        _id,
        title,
      },
    }
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
    subtitle,
    artistList[]{
      additionalContext,
      _key,
      artistRef->{
        name,
        "slug": slug.current,
      }
    },
    downloadFiles[] {
      ...,
      fileForDownload {
        asset->{
          url,
          size,
          originalFilename,
          _id
        }
      }
    },
    publishedAt, 
    "slug": slug.current,
    coverImage,
    minimumTier,
    ogDescription,
    filters[]->{
      "slug": slug.current
    },
    pageContent[]{
      ...,
      _type == 'pdfEmbed' => {
        ...,
        pdfFile {
          ...,
          asset-> {
          url,
          originalFilename
          }
        }
      },
      _type == 'introText' => {
        ...,
        body[] {
          ...,
          _type == 'templateText' => {
            ...,
            "body": @->.body
          },
        }
      },
      _type == 'postContent' => {
      ...,
        body[] {
        ...,
          _type == 'audioInline' => {
            ...,
            audioFile {
              ...,
              asset-> {
                playbackId
              }
            }
          },
          _type == 'video' => {
            ...,
            videoFile {
              ...,
              asset-> {
                playbackId
              }
            }
          }
        }
      }
    }
  }
`

export const postBySlugModalQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id, 
    title, 
    subtitle,
    artistList[]{
      additionalContext,
      _key,
      artistRef->{
        name,
        "slug": slug.current,
      }
    },
    publishedAt, 
    "slug": slug.current,
    coverImage,
    previewImage{
      _type,
      asset->{
        _id,
        url,
        "lqip": metadata.lqip,
      }
    },
    minimumTier,
    ogDescription,
    filters[]->{
      "slug": slug.current
    },
  }
`
export const bookmarkedQuery = groq`
  *[_type =="post" && defined(slug) && _id in $ids] {
    _id,
    title,
    coverImage,
    subtitle,
    "slug": slug.current
  }

`
export const postsByArtistSlugQuery = groq`
{ "results": *[_type == "artist" && defined(slug) && slug.current == $slug][0]{
    ...,
      "posts": *[_type == "post" && defined(slug) && references(^._id)] | order(publishedAt desc) {
        ${postQueryFields}
      }
    }
}
    
`
export const postsBySeriesSlugQuery = groq`
 {
"results": *[_type == "series" && defined(slug) && slug.current == $slug][0]{
    ...,
      "posts": *[_type == "post" && defined(slug) && references(^._id)] | order(publishedAt desc) {
        ${postQueryFields}
      }
    }
      }
    
`
export const pageBySlugQuery = groq`
  
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    pageContent[]{
      ...,
      _type == 'mainBody' => {
        ...,
      },
      _type == 'faq' => {
        ...,
      }
    }
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
