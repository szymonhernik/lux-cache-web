// @ts-nocheck

import TestQuery from '@/components/TestQuery'
import { Button } from '@/components/shadcn/ui/button'
import { PostsPayload } from '@/utils/types/sanity'
import { PostsQueryResult } from '@/utils/types/sanity/sanity.types'
import { EncodeDataAttributeCallback } from '@sanity/react-loader'
import { SanityDocument } from 'next-sanity'
import Image from 'next/image'
import Link from 'next/link'

export interface HomePageProps {
  data: PostsQueryResult | null
  encodeDataAttribute?: EncodeDataAttributeCallback
}

export default function HomePage({ data, encodeDataAttribute }: HomePageProps) {
  const { posts } = data || {}

  return (
    <main className="container mt-16 lg:mt-4 mx-auto grid grid-cols-1 ">
      <h1>Home page</h1>
      <Link href="/signin/password_signin">Log in </Link>
      <Link href="/signin/update_password">Update Password</Link>
    </main>
  )
}

// export default function HomePage({ data, encodeDataAttribute }: HomePageProps) {
//   const { posts } = data || {}

//   // Function to multiply posts
//   const multiplyPosts = (posts, multiplier = 10) => {
//     const multipliedPosts = []
//     for (let i = 0; i < multiplier; i++) {
//       posts.forEach((post) => {
//         multipliedPosts.push({
//           ...post,
//           _id: `${post._id}-${i}`, // Ensure unique ID for each post
//           title: `${post.title} (Copy ${i + 1})`
//         })
//       })
//     }
//     return multipliedPosts
//   }

//   // Multiply posts by 10 to simulate 200 posts
//   const multipliedPosts = multiplyPosts(posts, 10)

//   return (
//     <main className="container mt-16 lg:mt-4 mx-auto grid grid-cols-1 divide-y divide-neutral-400">
//       {multipliedPosts && multipliedPosts.length > 0 ? (
//         multipliedPosts.map((post) => (
//           <Link key={post._id} href={`post/${post.slug}`}>
//             <h2 className="p-4 hover:bg-neutral-100">{post.title}</h2>
//             <p>{post.ogDescription}</p>
//             {post.coverImage?.asset?.url && (
//               <Image
//                 alt={''}
//                 src={post.coverImage.asset.url}
//                 width={500}
//                 height={500}
//               ></Image>
//             )}
//           </Link>
//         ))
//       ) : (
//         <div className="p-4 text-red-500">No posts found</div>
//       )}
//     </main>
//   )
// }
