import { z } from 'zod'

export const tokenSchema = z
  .object({
    access_token: z.string(),
    // Make other fields optional
    token_type: z.string().optional(),
    expires_in: z.number().optional(),
    refresh_token: z.string().optional(),
    scope: z.string().optional()
  })
  .refine((data) => !!data.access_token, {
    message: 'Access token is required'
  })

export const discordUserSchema = z
  .object({
    id: z.string()
  })
  .passthrough()
