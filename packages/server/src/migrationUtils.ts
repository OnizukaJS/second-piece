import {type Knex} from 'knex'

import type {DbCustomTypes} from './constants'

const ADD_TO_HISTORY_FUNCTION_NAME = 'add_to_history'
const UPDATE_TIMESTAMP_FUNCTION_NAME = 'update_timestamp'

// ── Helper ──────────────────────────────────────────────────────────

const setColumnNotNullable = (knex: Knex, tableName: string, columnName: string) =>
  knex.schema.raw(`ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" SET NOT NULL;`)

// ── Enum helpers ────────────────────────────────────────────────────

export const addCustomEnumType = async (knex: Knex, name: DbCustomTypes, values: Record<string, string>) => {
  await knex.schema.raw(
    `CREATE TYPE "${name}" AS ENUM (${Object.values(values)
      .map((value) => `'${value}'`)
      .join(', ')})`,
  )
}

export const dropCustomType = async (knex: Knex, name: DbCustomTypes) => {
  await knex.schema.raw(`DROP TYPE IF EXISTS "${name}"`)
}

// ── Update timestamp function & trigger ─────────────────────────────

export const createOrReplaceUpdateTimestampFunction = async (knex: Knex) => {
  await knex.schema.raw(
    `CREATE OR REPLACE FUNCTION ${UPDATE_TIMESTAMP_FUNCTION_NAME}()
      RETURNS trigger
      LANGUAGE plpgsql
    AS $${UPDATE_TIMESTAMP_FUNCTION_NAME}$
      BEGIN
        NEW."updatedAt" = NOW();
        RETURN NEW;
      END;
    $${UPDATE_TIMESTAMP_FUNCTION_NAME}$;`,
  )
}

export const dropUpdateTimestampFunction = async (knex: Knex) => {
  await knex.schema.raw(`DROP FUNCTION IF EXISTS ${UPDATE_TIMESTAMP_FUNCTION_NAME}()`)
}

export const addUpdateTimestampTrigger = async (
  knex: Knex,
  table: string,
  triggerName: string = `on_update_${table}_timestamp`,
) =>
  await knex.schema.raw(`
    CREATE TRIGGER ${triggerName}
    BEFORE UPDATE ON "${table}"
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE PROCEDURE ${UPDATE_TIMESTAMP_FUNCTION_NAME}();
  `)

export const dropUpdateTimestampTrigger = async (
  knex: Knex,
  table: string,
  triggerName: string = `on_update_${table}_timestamp`,
) => await knex.schema.raw(`DROP TRIGGER IF EXISTS ${triggerName} ON "${table}"`)

// ── History function & triggers ─────────────────────────────────────

export const createOrReplaceAddToHistoryFunction = async (knex: Knex) => {
  await knex.schema.raw(
    `CREATE OR REPLACE FUNCTION ${ADD_TO_HISTORY_FUNCTION_NAME}()
      RETURNS trigger
      LANGUAGE plpgsql
    AS $${ADD_TO_HISTORY_FUNCTION_NAME}$
      DECLARE meta JSONB;
      BEGIN
        meta := jsonb_build_object('dbUser', current_user, 'op', TG_OP, 'dbClient', current_setting('application_name'));
        IF (TG_OP = 'UPDATE') THEN
          EXECUTE format('INSERT INTO %s SELECT ''%s''::JSONB, $1.*', TG_ARGV[0], meta) USING NEW;
          RETURN NEW;
        ELSIF (TG_OP = 'INSERT') THEN
          EXECUTE format('INSERT INTO %s SELECT ''%s''::JSONB, $1.*', TG_ARGV[0], meta) USING NEW;
          RETURN NEW;
        ELSIF (TG_OP = 'DELETE') THEN
          EXECUTE format('INSERT INTO %s SELECT ''%s''::JSONB, $1.*', TG_ARGV[0], meta) USING OLD;
          RETURN OLD;
        ELSE
          RAISE WARNING '[${ADD_TO_HISTORY_FUNCTION_NAME}] - Other action occurred: %, at %', TG_OP, now();
          RETURN NULL;
        END IF;
      END;
    $${ADD_TO_HISTORY_FUNCTION_NAME}$;`,
  )
}

export const dropAddToHistoryFunction = async (knex: Knex) => {
  await knex.schema.raw(`DROP FUNCTION IF EXISTS ${ADD_TO_HISTORY_FUNCTION_NAME}()`)
}

const addHistoryAfterDeleteTrigger = async (
  knex: Knex,
  table: string,
  historyTable: string,
  triggerName: string = `on_delete_${table}`,
) =>
  await knex.schema.raw(`
    CREATE TRIGGER ${triggerName} AFTER DELETE ON "${table}"
    FOR EACH ROW
    EXECUTE PROCEDURE ${ADD_TO_HISTORY_FUNCTION_NAME}('"${historyTable}"')
  `)

const addHistoryTrigger = async (
  knex: Knex,
  table: string,
  historyTable: string,
  insertTrigger: string = `on_insert_${table}`,
  updateTrigger: string = `on_update_${table}`,
  deleteTrigger?: string,
) => {
  await knex.schema.raw(`
    CREATE TRIGGER ${updateTrigger} AFTER UPDATE ON "${table}"
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE PROCEDURE ${ADD_TO_HISTORY_FUNCTION_NAME}('"${historyTable}"')
  `)
  await knex.schema.raw(`
    CREATE TRIGGER ${insertTrigger} AFTER INSERT ON "${table}"
    FOR EACH ROW
    EXECUTE PROCEDURE ${ADD_TO_HISTORY_FUNCTION_NAME}('"${historyTable}"')
  `)
  await addHistoryAfterDeleteTrigger(knex, table, historyTable, deleteTrigger)
}

const dropHistoryAfterDeleteTrigger = async (
  knex: Knex,
  table: string,
  triggerName: string = `on_delete_${table}`,
) => await knex.schema.raw(`DROP TRIGGER IF EXISTS ${triggerName} ON "${table}"`)

const dropHistoryTrigger = async (
  knex: Knex,
  table: string,
  insertTrigger: string = `on_insert_${table}`,
  updateTrigger: string = `on_update_${table}`,
  deleteTrigger?: string,
) => {
  await dropHistoryAfterDeleteTrigger(knex, table, deleteTrigger)
  await knex.schema.raw(`DROP TRIGGER IF EXISTS ${updateTrigger} ON "${table}"`)
  await knex.schema.raw(`DROP TRIGGER IF EXISTS ${insertTrigger} ON "${table}"`)
}

// ── History table creation / deletion ───────────────────────────────

const convertEnumsToStrings = async (knex: Knex, table: string) => {
  const columnInfo = await knex(table).columnInfo()
  const enumColumns = Object.entries(columnInfo)
    .filter(([, info]) => (info as any).type === 'USER-DEFINED')
    .map(([name]) => name)

  if (enumColumns.length > 0) {
    await knex.schema.alterTable(table, (t) => {
      enumColumns.forEach((columnName) => t.string(columnName).alter())
    })
  }
}

export const createHistoryTable = async (knex: Knex, table: string, options: {cloneData: boolean} = {cloneData: true}) => {
  const historyTable = `${table}History`
  const limit = options.cloneData ? '' : ' LIMIT 0'

  await knex.schema.raw(
    `CREATE TABLE "${historyTable}" AS (SELECT jsonb_build_object() AS "historyMeta", * FROM "${table}"${limit})`,
  )

  await setColumnNotNullable(knex, historyTable, 'updatedAt')
  await addHistoryTrigger(knex, table, historyTable)
  await convertEnumsToStrings(knex, historyTable)
}

export const deleteHistoryTable = async (knex: Knex, table: string) => {
  const historyTable = `${table}History`
  await knex.schema.dropTable(historyTable)
  await dropHistoryTrigger(knex, table)
}
