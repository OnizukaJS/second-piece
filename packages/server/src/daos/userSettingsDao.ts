import {db} from '../db'
import {UserSettings} from './types/database'

const TABLE_NAME = 'userSettings'

export namespace userSettingsDao {
  export const create = async (data: {userId: string}): Promise<UserSettings> => {
    const [settings] = await db(TABLE_NAME).insert(data).returning('*')
    return settings
  }

  export const getByUserId = async (userId: string): Promise<UserSettings> => await db(TABLE_NAME).first().where({userId})

  export const update = async (userId: string, data: {language?: string; displayMode?: string}): Promise<UserSettings> => {
    const [settings] = await db(TABLE_NAME).where({userId}).update(data).returning('*')
    return settings
  }
}
