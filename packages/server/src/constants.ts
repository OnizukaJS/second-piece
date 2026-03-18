import type {Enum} from '@shared/typings/utils'

export const DB_CUSTOM_TYPES = {
  USER_STATUS: 'user_status',
  TOKEN_TYPE: 'token_type',
} as const

export type DbCustomTypes = Enum<typeof DB_CUSTOM_TYPES>

export const SALT_ROUNDS = 10

export const TOKEN_LIFE_SPAN = {
  SESSION: 60 * 24, // 24 hours in minutes
} as const
