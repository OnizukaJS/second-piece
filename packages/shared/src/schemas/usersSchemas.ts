import {z} from 'zod'

import {DISPLAY_MODE, LANGUAGE, USER_STATUS} from '../sharedConstants'

export const userSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  status: z.nativeEnum(USER_STATUS),
})

export type User = z.infer<typeof userSchema>

export const authResponseSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
})

export type AuthResponse = z.infer<typeof authResponseSchema>

export const userSettingsSchema = z.object({
  userSettingsId: z.string().uuid(),
  userId: z.string().uuid(),
  language: z.nativeEnum(LANGUAGE),
  displayMode: z.nativeEnum(DISPLAY_MODE),
})

export type UserSettings = z.infer<typeof userSettingsSchema>

export const userDetailsSchema = userSchema
  .omit({status: true})
  .and(
    z.object({
      userSettings: userSettingsSchema.omit({userId: true})
    })
  )

export type UserDetails = z.infer<typeof userDetailsSchema>
