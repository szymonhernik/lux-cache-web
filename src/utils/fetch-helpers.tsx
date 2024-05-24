import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { PostsQueryResult } from './types/sanity/sanity.types'

const numberOfItemsPerPage = 8

const fetchPostsFromSanity = async ({
  lastPublishedAt = undefined,
  lastId = undefined
}) => {
  // freeze for 3 seconds
  // await new Promise((resolve) => setTimeout(resolve, 3000))
  const result = await client.fetch(
    groq`{"posts": *[_type == "post" && (
    publishedAt < $lastPublishedAt
    || (publishedAt == $lastPublishedAt && _id < $lastId)
  )] | order(publishedAt desc)  [0...${numberOfItemsPerPage as number}] {
    _id, title, publishedAt, "slug": slug.current,
  }}`,
    { lastPublishedAt, lastId }
  )

  if (result.length > 0) {
    lastPublishedAt = result.posts[result.posts.length - 1].publishedAt
    lastId = result.posts[result.posts.length - 1]._id
  } else {
    lastId = undefined // Reached the end
  }

  const r = result as PostsQueryResult
  const posts = r.posts

  return posts
}

const fetchPostsSimple = async () => {
  // freeze for 3 seconds
  // await new Promise((resolve) => setTimeout(resolve, 3000))
  const result = await client.fetch(
    groq`{
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
  )

  const r = result as PostsQueryResult
  const posts = r.posts

  return posts
}

export { fetchPostsFromSanity, numberOfItemsPerPage }
