import type {RouterContext} from 'koa-router'

import {HTTP_STATUS} from '@shared/sharedConstants'

import {db} from '../db'

const TOKEN_COOKIE_NAME = 'appToken'

export const authenticate = async (ctx: RouterContext, next: () => Promise<void>) => {
  const token = ctx.cookies.get(TOKEN_COOKIE_NAME)

  if (!token) {
    ctx.status = HTTP_STATUS.UNAUTHORIZED
    ctx.body = {error: 'Authentication required'}
    return
  }

  const tokenRow = await db('tokens').where({token}).andWhere('expireAt', '>', new Date()).first()

  if (!tokenRow) {
    ctx.status = HTTP_STATUS.UNAUTHORIZED
    ctx.body = {error: 'Invalid or expired token'}
    return
  }

  const user = await db('users').where({userId: tokenRow.userId}).first()

  if (!user) {
    ctx.status = HTTP_STATUS.UNAUTHORIZED
    ctx.body = {error: 'User not found'}
    return
  }

  ctx.state.user = user
  ctx.state.token = tokenRow

  await next()
}
