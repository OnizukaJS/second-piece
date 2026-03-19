import {db} from '../db'

const TABLE_NAME = 'userSettings'

export namespace userSettingsDao {
  export const create = async (data: {userId: string}) => {
    const [settings] = await db(TABLE_NAME).insert(data).returning('*')
    return settings
  }

  export const getByUserId = async (userId: string) => await db(TABLE_NAME).first().where({userId})

  export const update = async (userId: string, data: Record<string, unknown>) => {
    const [settings] = await db(TABLE_NAME).where({userId}).update(data).returning('*')
    return settings
  }
}
