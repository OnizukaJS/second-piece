import type {Knex} from 'knex'

import {USER_STATUS} from '@shared/sharedConstants'

import {DB_CUSTOM_TYPES} from '../constants'

import {
  addCustomEnumType,
  addUpdateTimestampTrigger,
  createHistoryTable,
  deleteHistoryTable,
  dropCustomType,
  dropUpdateTimestampTrigger,
} from '../migrationUtils'

const TABLE_NAME = 'users'

export async function up(knex: Knex): Promise<void> {
  await addCustomEnumType(knex, DB_CUSTOM_TYPES.USER_STATUS, USER_STATUS)

  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid('userId').primary().defaultTo(knex.fn.uuid())
    table.string('name').nullable()
    table.string('email').notNullable().unique()
    table.string('password').notNullable()
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now())
    table
      .enu('status', [], {
        useNative: true,
        existingType: true,
        enumName: DB_CUSTOM_TYPES.USER_STATUS,
      })
      .notNullable()
    table.string('phoneNumber').nullable()
    table.string('avatarUrl').nullable()
    table.string('firstName').nullable()
    table.string('lastName').nullable()
    table.date('dateOfBirth').nullable()
  })

  await addUpdateTimestampTrigger(knex, TABLE_NAME)
  await createHistoryTable(knex, TABLE_NAME)
}

export async function down(knex: Knex): Promise<void> {
  await deleteHistoryTable(knex, TABLE_NAME)
  await dropUpdateTimestampTrigger(knex, TABLE_NAME)
  await knex.schema.dropTableIfExists(TABLE_NAME)
  await dropCustomType(knex, DB_CUSTOM_TYPES.USER_STATUS)
}
