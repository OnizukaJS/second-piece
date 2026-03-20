import {HTTP_STATUS} from '@shared/sharedConstants'

import {usersDao} from '../daos/usersDao'
import {AppError} from '../errors'
import {UsersId} from '../daos/types/database'

export namespace usersFacade {
  export const createUser = async (data: Record<string, unknown>) => {
    return await usersDao.create(data)
  }

  export const getUsers = async () => {
    return await usersDao.getUsers()
  }

  export const getCurrentUser = async (userId: UsersId) => {
    const user = await usersDao.getByUserId(userId)
    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'User not found')
    }

    const {userSettingsId, displayMode, language, ...userData} = user

    return {
      ...userData,
      userSettings: {
        userSettingsId,
        displayMode, 
        language
      }
    }
  }

  export const getUserById = async (userId: UsersId) => {
    const user = await usersDao.getByUserId(userId)
    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'User not found')
    }
    return user
  }

  export const updateUser = async (userId: UsersId, data: Record<string, unknown>) => {
    const user = await usersDao.update(userId, data)
    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'User not found')
    }
    return user
  }

  export const deleteUser = async (userId: UsersId) => {
    const deleted = await usersDao.remove(userId)
    if (!deleted) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'User not found')
    }
  }
}
