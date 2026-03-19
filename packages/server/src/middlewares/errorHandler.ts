import type {Context, Next} from 'koa'

import {AppError} from '../errors'
import { HTTP_STATUS } from '@shared/sharedConstants'

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next()
  } catch (error) {
    if (error instanceof AppError) {
      ctx.status = error.statusCode
      ctx.body = {error: error.message}
      return
    }
    console.error('Unexpected error:', error)
    ctx.status = HTTP_STATUS.INTERNAL_SERVER_ERROR
    ctx.body = {error: 'Internal server error'}
  }
}
