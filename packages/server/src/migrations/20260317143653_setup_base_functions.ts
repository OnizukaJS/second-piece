import type {Knex} from 'knex'

import {
  createOrReplaceAddToHistoryFunction,
  createOrReplaceUpdateTimestampFunction,
  dropAddToHistoryFunction,
  dropUpdateTimestampFunction,
} from '../migrationUtils'

export async function up(knex: Knex): Promise<void> {
  await createOrReplaceUpdateTimestampFunction(knex)
  await createOrReplaceAddToHistoryFunction(knex)
}

export async function down(knex: Knex): Promise<void> {
  await dropAddToHistoryFunction(knex)
  await dropUpdateTimestampFunction(knex)
}
