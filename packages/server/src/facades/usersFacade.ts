import {HTTP_STATUS} from '@shared/sharedConstants'

import {usersDao} from '../daos/usersDao'
import {AppError} from '../errors'

export namespace usersFacade {
  export const createUser = async (data: Record<string, unknown>) => {
    return await usersDao.create(data)
  }

  export const getUsers = async () => {
    return await usersDao.getUsers()
  }

  export const getUserById = async (userId: string) => {
    const user = await usersDao.getByUserId(userId)
    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'User not found')
    }
    return user
  }

  export const updateUser = async (userId: string, data: Record<string, unknown>) => {
    const user = await usersDao.update(userId, data)
    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'User not found')
    }
    return user
  }

  export const deleteUser = async (userId: string) => {
    const deleted = await usersDao.remove(userId)
    if (!deleted) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'User not found')
    }
  }
}
