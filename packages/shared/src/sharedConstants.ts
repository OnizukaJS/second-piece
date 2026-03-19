export const APP_NAME = 'Second Piece'

export const USER_STATUS = {
  OK: 'ok',
  DISABLED: 'disabled',
  DELETED: 'deleted',
} as const

export const TOKEN_TYPE = {
  APP_TOKEN: 'app_token',
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
} as const
