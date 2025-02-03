import { z } from 'zod'

export const authSchema = {
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
      message:
        'Password must contain at least one lowercase letter, one uppercase letter, and one digit'
    })
}

export const signUpSchema = z
  .object({
    email: authSchema.email,
    password: authSchema.password,
    confirmPassword: z.string()
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword
    },
    {
      message: 'Passwords must match',
      path: ['confirmPassword']
    }
  )
export const passwordResetSchema = z.object({
  email: authSchema.email
})

export const passwordUpdateSchema = z.object({
  password: authSchema.password
})
// This is the schema for the UpdatePassword form
export const passwordUpdateFormSchema = z
  .object({
    password: authSchema.password,
    confirmPassword: z.string()
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword']
  })

export const emailUpdateSchema = z.object({
  newEmail: authSchema.email
})

export const inviteContributorSchema = z.object({
  email: z.string().email('Please enter a valid email')
})

export const nameUpdateSchema = z.object({
  fullName: z
    .string()
    .min(1, "Name can't be empty")
    .max(64, "Name can't exceed 64 characters")
})

export const signInSchema = z.object({
  email: authSchema.email,
  password: z.string().min(1, { message: 'Please enter your password.' })
})

export type SignInSchema = z.infer<typeof signInSchema>

export type NameUpdateSchema = z.infer<typeof nameUpdateSchema>

export type EmailUpdateSchema = z.infer<typeof emailUpdateSchema>

export type SignUpSchema = z.infer<typeof signUpSchema>
export type PasswordResetSchema = z.infer<typeof passwordResetSchema>
export type PasswordUpdateSchema = z.infer<typeof passwordUpdateSchema>
export type PasswordUpdateFormSchema = z.infer<typeof passwordUpdateFormSchema>
