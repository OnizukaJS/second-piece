import type {RouterContext} from 'koa-router'

import {HTTP_STATUS} from '@shared/sharedConstants'

import {usersFacade} from '../facades/usersFacade'

export const createUser = async (ctx: RouterContext) => {
  ctx.status = HTTP_STATUS.CREATED
  ctx.body = await usersFacade.createUser(ctx.request.body as Record<string, unknown>)
}

export const getCurrentUser = async (ctx: RouterContext) => {
  ctx.status = HTTP_STATUS.OK
  ctx.body = await usersFacade.getCurrentUser(ctx.state.userId)
}

export const getUsers = async (ctx: RouterContext) => {
  ctx.status = HTTP_STATUS.OK
  ctx.body = await usersFacade.getUsers()
}

export const getUserById = async (ctx: RouterContext) => {
  ctx.status = HTTP_STATUS.OK
  ctx.body = await usersFacade.getUserById(ctx.params.id)
}

export const updateUser = async (ctx: RouterContext) => {
  ctx.status = HTTP_STATUS.OK
  ctx.body = await usersFacade.updateUser(ctx.params.id, ctx.request.body as Record<string, unknown>)
}

export const deleteUser = async (ctx: RouterContext) => {
  await usersFacade.deleteUser(ctx.params.id)
  ctx.status = HTTP_STATUS.NO_CONTENT
}
