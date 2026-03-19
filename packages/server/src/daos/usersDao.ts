import {db} from '../db'

const TABLE_NAME = 'users'

export namespace usersDao {
  export const create = async (data: Record<string, unknown>) => {
    const [user] = await db(TABLE_NAME).insert(data).returning('*')
    return user
  }

  export const getUsers = async () => await db(TABLE_NAME).select()

  export const getByUserId = async (userId: string) => await db(TABLE_NAME).first().where({userId})

  export const getByEmail = async (email: string) => await db(TABLE_NAME).first().where({email})

  export const update = async (userId: string, data: Record<string, unknown>) => {
    const [user] = await db(TABLE_NAME).where({userId}).update(data).returning('*')
    return user
  }

  export const remove = async (userId: string) => await db(TABLE_NAME).where({userId}).del()
}
