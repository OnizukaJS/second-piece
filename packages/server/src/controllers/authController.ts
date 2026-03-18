import bcrypt from 'bcrypt'
import {randomBytes} from 'crypto'
import type {RouterContext} from 'koa-router'

import {HTTP_STATUS, USER_STATUS, TOKEN_TYPE} from '@shared/sharedConstants'

import {SALT_ROUNDS, TOKEN_LIFE_SPAN} from '../constants'
import {db} from '../db'

const TOKEN_COOKIE_NAME = 'appToken'

const generateToken = () => randomBytes(32).toString('hex')

const generateExpiryDate = (lifespanMinutes: number) =>
  new Date(Date.now() + lifespanMinutes * 60 * 1000)

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

  if (!email || !password) {
    ctx.status = HTTP_STATUS.BAD_REQUEST
    ctx.body = {error: 'Email and password are required'}
    return
  }

  const existingUser = await db('users').where({email}).first()
  if (existingUser) {
    ctx.status = HTTP_STATUS.CONFLICT
    ctx.body = {error: 'Email already in use'}
    return
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

  const [user] = await db('users')
    .insert({
      email,
      password: hashedPassword,
      status: USER_STATUS.OK,
      name,
      firstName,
      lastName,
    })
    .returning('*')

  const token = generateToken()
  const expireAt = generateExpiryDate(TOKEN_LIFE_SPAN.SESSION)

  await db('tokens').insert({
    userId: user.userId,
    token,
    type: TOKEN_TYPE.APP_TOKEN,
    expireAt,
  })

  setTokenCookie(ctx, token, expireAt)

  ctx.status = HTTP_STATUS.CREATED
  ctx.body = {userId: user.userId, email: user.email}
}

export const login = async (ctx: RouterContext) => {
  const {email, password} = ctx.request.body as Record<string, string>

  if (!email || !password) {
    ctx.status = HTTP_STATUS.BAD_REQUEST
    ctx.body = {error: 'Email and password are required'}
    return
  }

  const user = await db('users').where({email}).first()

  if (!user || !(await bcrypt.compare(password, user.password))) {
    ctx.status = HTTP_STATUS.UNAUTHORIZED
    ctx.body = {error: 'Invalid email or password'}
    return
  }

  await db('tokens').where({userId: user.userId}).andWhere('expireAt', '<=', new Date()).del()

  const token = generateToken()
  const expireAt = generateExpiryDate(TOKEN_LIFE_SPAN.SESSION)

  await db('tokens').insert({
    userId: user.userId,
    token,
    type: TOKEN_TYPE.APP_TOKEN,
    expireAt,
  })

  setTokenCookie(ctx, token, expireAt)

  ctx.status = HTTP_STATUS.OK
  ctx.body = {userId: user.userId, email: user.email}
}

export const logout = async (ctx: RouterContext) => {
  const token = ctx.cookies.get(TOKEN_COOKIE_NAME)

  if (token) {
    await db('tokens').where({token}).del()
    ctx.cookies.set(TOKEN_COOKIE_NAME, '', {expires: new Date(0)})
  }

  ctx.status = HTTP_STATUS.NO_CONTENT
}
