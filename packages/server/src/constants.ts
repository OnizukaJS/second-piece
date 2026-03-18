import type {Enum} from '@shared/typings/utils'

export const DB_CUSTOM_TYPES = {
  USER_STATUS: 'user_status',
} as const

export type DbCustomTypes = Enum<typeof DB_CUSTOM_TYPES>
