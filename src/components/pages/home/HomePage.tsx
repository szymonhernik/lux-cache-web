// ./components/Posts.tsx

import { PostsPayload } from '@/utils/types/sanity'
import { EncodeDataAttributeCallback } from '@sanity/react-loader'
import { SanityDocument } from 'next-sanity'
import Link from 'next/link'

export interface HomePageProps {
  data: PostsPayload | null
  encodeDataAttribute?: EncodeDataAttributeCallback
}

export default function HomePage({ data, encodeDataAttribute }: HomePageProps) {
  const { posts } = data || {}

  return (
    <main className="container mx-auto grid grid-cols-1 divide-y divide-blue-100">
      {posts && posts?.length > 0 ? (
        posts.map((post) => (
          <Link key={post._id} href={post.slug.current}>
            <h2 className="p-4 hover:bg-blue-50">{post.title}</h2>
          </Link>
        ))
      ) : (
        <div className="p-4 text-red-500">No posts found</div>
      )}
    </main>
  )
}
