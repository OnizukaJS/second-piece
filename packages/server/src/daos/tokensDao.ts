import {db} from '../db'

const TABLE_NAME = 'tokens'

export namespace tokensDao {
  export const create = async (data: {userId: string; token: string; type: string; expireAt: Date}) => {
    await db(TABLE_NAME).insert(data)
  }

  export const deleteByToken = async (token: string) => {
    await db(TABLE_NAME).where({token}).del()
  }

  export const deleteExpiredByUserId = async (userId: string) => {
    await db(TABLE_NAME).where({userId}).andWhere('expireAt', '<=', new Date()).del()
  }
}
