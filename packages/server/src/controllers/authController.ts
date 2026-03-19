import type {RouterContext} from 'koa-router'

import {HTTP_STATUS} from '@shared/sharedConstants'

import {authFacade} from '../facades/authFacade'

const TOKEN_COOKIE_NAME = 'appToken'

const setTokenCookie = (ctx: RouterContext, token: string, expireAt: Date) => {
  ctx.cookies.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: expireAt,
  })
}

export const register = async (ctx: RouterContext) => {
  const {email, password, name, firstName, lastName} = ctx.request.body as Record<string, string>
  const {user, session} = await authFacade.register({email, password, name, firstName, lastName})
  setTokenCookie(ctx, session.token, session.expireAt)
  ctx.status = HTTP_STATUS.CREATED
  ctx.body = {userId: user.userId, email: user.email}
}

export const login = async (ctx: RouterContext) => {
  const {email, password} = ctx.request.body as Record<string, string>
  const {user, session} = await authFacade.login(email, password)
  setTokenCookie(ctx, session.token, session.expireAt)
  ctx.status = HTTP_STATUS.OK
  ctx.body = {userId: user.userId, email: user.email}
}

export const loginWithGoogle = async (ctx: RouterContext) => {
  const {code} = ctx.request.body as Record<string, string>
  const {user, session} = await authFacade.loginWithGoogle(code)
  setTokenCookie(ctx, session.token, session.expireAt)
  ctx.status = HTTP_STATUS.OK
  ctx.body = {userId: user.userId, email: user.email}
}

export const logout = async (ctx: RouterContext) => {
  const token = ctx.cookies.get(TOKEN_COOKIE_NAME)
  await authFacade.logout(token)
  ctx.cookies.set(TOKEN_COOKIE_NAME, '', {expires: new Date(0)})
  ctx.status = HTTP_STATUS.NO_CONTENT
}
