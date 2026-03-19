import {db} from '../db'
import {Users} from './types/database'

const TABLE_NAME = 'users'

export namespace usersDao {
  export const create = async (data: Record<string, unknown>): Promise<Users> => {
    const [user] = await db(TABLE_NAME).insert(data).returning('*')
    return user
  }

  export const getUsers = async (): Promise<Users[]> => await db(TABLE_NAME).select()

  export const getByUserId = async (userId: string): Promise<Users> => await db(TABLE_NAME).first().where({userId})

  export const getByEmail = async (email: string): Promise<Users> => await db(TABLE_NAME).first().where({email})

  export const update = async (userId: string, data: Record<string, unknown>): Promise<Users> => {
    const [user] = await db(TABLE_NAME).where({userId}).update(data).returning('*')
    return user
  }

  export const remove = async (userId: string) => await db(TABLE_NAME).where({userId}).del()
}
