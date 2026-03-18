import type {Knex} from 'knex'

import {TOKEN_TYPE} from '@shared/sharedConstants'

import {DB_CUSTOM_TYPES} from '../constants'

import {
  addCustomEnumType,
  addUpdateTimestampTrigger,
  createHistoryTable,
  deleteHistoryTable,
  dropCustomType,
  dropUpdateTimestampTrigger,
} from '../migrationUtils'

const TABLE_NAME = 'tokens'

export async function up(knex: Knex): Promise<void> {
  await addCustomEnumType(knex, DB_CUSTOM_TYPES.TOKEN_TYPE, TOKEN_TYPE)

  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid('tokenId').primary().defaultTo(knex.fn.uuid())
    table.uuid('userId').notNullable().references('userId').inTable('users')
    table.string('token').notNullable().unique()
    table
      .enu('type', [], {
        useNative: true,
        existingType: true,
        enumName: DB_CUSTOM_TYPES.TOKEN_TYPE,
      })
      .notNullable()
    table.timestamp('expireAt').notNullable()
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now())
  })

  await addUpdateTimestampTrigger(knex, TABLE_NAME)
  await createHistoryTable(knex, TABLE_NAME)
}

export async function down(knex: Knex): Promise<void> {
  await deleteHistoryTable(knex, TABLE_NAME)
  await dropUpdateTimestampTrigger(knex, TABLE_NAME)
  await knex.schema.dropTableIfExists(TABLE_NAME)
  await dropCustomType(knex, DB_CUSTOM_TYPES.TOKEN_TYPE)
}
