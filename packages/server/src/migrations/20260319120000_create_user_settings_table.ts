import type {Knex} from 'knex'

import {DISPLAY_MODE, LANGUAGE} from '@shared/sharedConstants'

import {DB_CUSTOM_TYPES} from '../constants'

import {
  addCustomEnumType,
  addUpdateTimestampTrigger,
  createHistoryTable,
  deleteHistoryTable,
  dropCustomType,
  dropUpdateTimestampTrigger,
} from '../migrationUtils'

const TABLE_NAME = 'userSettings'

export async function up(knex: Knex): Promise<void> {
  await addCustomEnumType(knex, DB_CUSTOM_TYPES.LANGUAGE, LANGUAGE)
  await addCustomEnumType(knex, DB_CUSTOM_TYPES.DISPLAY_MODE, DISPLAY_MODE)

  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid('userSettingsId').primary().defaultTo(knex.fn.uuid())
    table.uuid('userId').notNullable().unique().references('userId').inTable('users')
    table
      .enu('language', [], {
        useNative: true,
        existingType: true,
        enumName: DB_CUSTOM_TYPES.LANGUAGE,
      })
      .notNullable()
      .defaultTo(LANGUAGE.ES)
    table
      .enu('displayMode', [], {
        useNative: true,
        existingType: true,
        enumName: DB_CUSTOM_TYPES.DISPLAY_MODE,
      })
      .notNullable()
      .defaultTo(DISPLAY_MODE.SYSTEM)
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
  await dropCustomType(knex, DB_CUSTOM_TYPES.LANGUAGE)
  await dropCustomType(knex, DB_CUSTOM_TYPES.DISPLAY_MODE)
}
