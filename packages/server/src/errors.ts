import type {Enum} from '@shared/typings/utils'

import {HTTP_STATUS} from '@shared/sharedConstants'

type HttpStatus = Enum<typeof HTTP_STATUS>

export class AppError extends Error {
  constructor(
    public statusCode: HttpStatus,
    message: string,
  ) {
    super(message)
  }
}
