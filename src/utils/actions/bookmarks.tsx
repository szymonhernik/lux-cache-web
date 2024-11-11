'use server'

import { createClient } from '@/utils/supabase/server'
import { isAuthenticated } from '@/utils/data/auth'
import { revalidatePath } from 'next/cache'
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers'

//USED!
//checked for authentication
// ✅ check for authentication
export async function removeBookmark(formData: FormData) {
  if (!(await isAuthenticated())) {
    throw new Error('Unauthorized')
  }

  const postId = formData.get('postId') as string

  const supabase = createClient()

  try {
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
    console.error('Error removing bookmark:', error)
    return getErrorRedirect(
      '/bookmarks',
      'Hmm... Something went wrong.',
      'Bookmark could not be removed.'
    )
  }
}

export async function toggleBookmark(
  post_id: string,
  slug: string,
  userHasBookmarked: boolean
) {
  if (!(await isAuthenticated())) {
    throw new Error('Unauthorized')
  }

  const supabase = createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  const user_id = user!.id

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
  return { success: true }
}
