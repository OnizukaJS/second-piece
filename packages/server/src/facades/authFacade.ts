import bcrypt from 'bcrypt'
import {randomBytes} from 'crypto'

import {HTTP_STATUS, USER_STATUS, TOKEN_TYPE} from '@shared/sharedConstants'

import {getGoogleOAuthClient} from '../config/google'
import {SALT_ROUNDS, TOKEN_LIFE_SPAN} from '../constants'
import {tokensDao} from '../daos/tokensDao'
import {userSettingsDao} from '../daos/userSettingsDao'
import {usersDao} from '../daos/usersDao'
import {AppError} from '../errors'

const generateToken = () => randomBytes(32).toString('hex')

const generateExpiryDate = (lifespanMinutes: number) => new Date(Date.now() + lifespanMinutes * 60 * 1000)

const createSession = async (userId: string) => {
  await tokensDao.deleteExpiredByUserId(userId)
  const token = generateToken()
  const expireAt = generateExpiryDate(TOKEN_LIFE_SPAN.SESSION)
  await tokensDao.create({userId, token, type: TOKEN_TYPE.APP_TOKEN, expireAt})
  return {token, expireAt}
}

export namespace authFacade {
  export const register = async (params: {
    email: string
    password: string
    name?: string
    firstName?: string
    lastName?: string
  }) => {
    if (!params.email || !params.password) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Email and password are required')
    }

    const existingUser = await usersDao.getByEmail(params.email)
    if (existingUser) {
      throw new AppError(HTTP_STATUS.CONFLICT, 'Email already in use')
    }

    const hashedPassword = await bcrypt.hash(params.password, SALT_ROUNDS)
    const user = await usersDao.create({
      email: params.email,
      password: hashedPassword,
      status: USER_STATUS.OK,
      name: params.name,
      firstName: params.firstName,
      lastName: params.lastName,
    })

    await userSettingsDao.create({userId: user.userId})

    const session = await createSession(user.userId)
    return {user, session}
  }

  export const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Email and password are required')
    }

    const user = await usersDao.getByEmail(email)
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password')
    }

    const session = await createSession(user.userId)
    return {user, session}
  }

  export const loginWithGoogle = async (code: string) => {
    if (!code) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Authorization code is required')
    }

    const client = getGoogleOAuthClient()
    const {tokens} = await client.getToken(code)
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()!
    const email = payload.email!

    let user = await usersDao.getByEmail(email)
    if (!user) {
      user = await usersDao.create({
        email,
        status: USER_STATUS.OK,
        name: payload.name ?? null,
        firstName: payload.given_name ?? null,
        lastName: payload.family_name ?? null,
      })
      await userSettingsDao.create({userId: user.userId})
    }

    const session = await createSession(user.userId)
    return {user, session}
  }

  export const logout = async (token: string | undefined) => {
    if (token) {
      await tokensDao.deleteByToken(token)
    }
  }
}
