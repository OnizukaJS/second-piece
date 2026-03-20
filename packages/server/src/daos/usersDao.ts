import {db} from '../db'
import {Users, UserSettings} from './types/database'

const TABLE_NAME = 'users'

export namespace usersDao {
  export const create = async (data: Record<string, unknown>): Promise<Users> => {
    const [user] = await db(TABLE_NAME).insert(data).returning('*')
    return user
  }

  export const getUsers = async (): Promise<Users[]> => await db(TABLE_NAME).select()

  export type UserDetails = Pick<Users, 'userId' | 'name' | 'firstName' | 'lastName' | 'email'> 
    & Pick<UserSettings, 'userSettingsId' | 'language' | 'displayMode'>

  export const getByUserId = async (
    userId: string
  ): Promise<UserDetails> => await db(TABLE_NAME).select(
    'users.userId',
    'users.name',
    'users.firstName',
    'users.lastName',
    'users.email',
    'userSettings.userSettingsId',
    'userSettings.language',
    'userSettings.displayMode',
  )
  .join('userSettings', 'userSettings.userId', 'users.userId')
  .first()
  .where({'users.userId': userId})

  export const getByEmail = async (email: string): Promise<Users> => await db(TABLE_NAME).first().where({email})

  export const update = async (userId: string, data: Record<string, unknown>): Promise<Users> => {
    const [user] = await db(TABLE_NAME).where({userId}).update(data).returning('*')
    return user
  }

  export const remove = async (userId: string) => await db(TABLE_NAME).where({userId}).del()
}
