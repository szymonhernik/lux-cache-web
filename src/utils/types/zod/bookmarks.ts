import { z } from 'zod'

// This defines the validation rules
export const bookmarkSchema = z.object({
  post_id: z.string().uuid('Invalid post ID format'),
  user_id: z.string().uuid('Invalid user ID format')
})
export const postIdSchema = z.string().uuid('Invalid post ID format')
