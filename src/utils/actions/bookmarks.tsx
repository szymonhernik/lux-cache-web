'use server'

import { createClient } from '@/utils/supabase/server'
import { isAuthenticated } from '@/utils/data/auth'
import { revalidatePath } from 'next/cache'
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers'
import { z } from 'zod'
import { headers } from 'next/headers'
import { ratelimit } from '../upstash/ratelimit'
import { bookmarkSchema, postIdSchema } from '../types/zod/bookmarks'
import { checkRateLimit } from '../upstash/helpers'

//USED!
// ✅ check for authentication
// ✅ add rate limitting to the request
export async function removeBookmark(formData: FormData) {
  // rate limit to 10 requests per 10 seconds
  try {
    await checkRateLimit('bookmark')
  } catch (error) {
    throw new Error('Rate limit exceeded in removeBookmark endpoint')
  }
  if (!(await isAuthenticated())) {
    throw new Error('Unauthorized in removeBookmark endpoint')
  }

  const postId = formData.get('postId') as string

  //validate postId to be a uuid with zod
  const { success } = postIdSchema.safeParse(postId)
  if (!success) {
    throw new Error('Invalid post ID format')
  }

  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('post_id', postId)

    if (error) {
      return getErrorRedirect(
        '/bookmarks',
        'Bookmark could not be removed.',
        error.message
      )
    }

    // Revalidate the bookmarks page to reflect the changes
    revalidatePath('/bookmarks')
    return getStatusRedirect(
      '/bookmarks',
      'Success!',
      'Bookmark has been removed.'
    )
  } catch (error) {
    return getErrorRedirect(
      '/bookmarks',
      'Hmm... Something went wrong.',
      'Bookmark could not be removed.'
    )
  }
}

//USED!
// ✅ check for authentication
// ✅ add rate limitting to the request
export async function toggleBookmark(
  post_id: string,
  slug: string,
  userHasBookmarked: boolean
) {
  // rate limit to 10 requests per 10 seconds
  try {
    await checkRateLimit('bookmark')
  } catch (error) {
    throw new Error('Rate limit exceeded in toggleBookmark endpoint')
  }

  if (!(await isAuthenticated())) {
    throw new Error('Unauthorized in toggleBookmark endpoint')
  }

  const supabase = createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  const user_id = user!.id

  bookmarkSchema.parse({ post_id, user_id })

  let redirectPath: string

  try {
    if (userHasBookmarked) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('post_id', post_id)
        .eq('user_id', user_id)
    } else {
      await supabase.from('bookmarks').insert({ user_id, post_id })
    }
    revalidatePath(`/post/${slug}`)
    return getStatusRedirect(
      `/post/${slug}`,
      'Success!',
      'Bookmark has been updated.'
    )
  } catch (error) {
    redirectPath = getErrorRedirect(
      `/post/${slug}`,
      'Hmm... Something went wrong.',
      'Bookmark could not be updated.'
    )
    return redirectPath
  }
}
