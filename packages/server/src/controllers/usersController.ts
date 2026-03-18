import type {RouterContext} from 'koa-router'

import {HTTP_STATUS} from '@shared/sharedConstants'

import {db} from '../db'

const TABLE_NAME = 'users'

export const getUsers = async (ctx: RouterContext) => {
  const users = await db(TABLE_NAME).select()
  ctx.body = users
}

export const getUserById = async (ctx: RouterContext) => {
  const user = await db(TABLE_NAME).where({userId: ctx.params.id}).first()
  if (!user) {
    ctx.status = HTTP_STATUS.NOT_FOUND
    ctx.body = {error: 'User not found'}
    return
  }
  ctx.body = user
}

export const createUser = async (ctx: RouterContext) => {
  const [user] = await db(TABLE_NAME).insert(ctx.request.body).returning('*')
  ctx.status = HTTP_STATUS.CREATED
  ctx.body = user
}

export const updateUser = async (ctx: RouterContext) => {
  const [user] = await db(TABLE_NAME)
    .where({userId: ctx.params.id})
    .update(ctx.request.body)
    .returning('*')
  if (!user) {
    ctx.status = HTTP_STATUS.NOT_FOUND
    ctx.body = {error: 'User not found'}
    return
  }
  ctx.body = user
}

export const deleteUser = async (ctx: RouterContext) => {
  const deleted = await db(TABLE_NAME).where({userId: ctx.params.id}).del()
  if (!deleted) {
    ctx.status = HTTP_STATUS.NOT_FOUND
    ctx.body = {error: 'User not found'}
    return
  }
  ctx.status = HTTP_STATUS.NO_CONTENT
}
