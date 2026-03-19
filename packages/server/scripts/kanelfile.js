const path = require('path')
const {recase} = require('@kristiandupont/recase')

require('dotenv').config({path: path.resolve(__dirname, '../../../.env')})

module.exports = {
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'secondpiece',
    password: process.env.DB_PASSWORD || 'secondpiece',
    database: process.env.DB_NAME || 'secondpiece',
    port: Number(process.env.DB_PORT) || 25432,
  },
  preDeleteModelFolder: true,

  modelNominator: recase('snake', 'pascal'),
  typeNominator: recase('snake', 'pascal'),

  customTypeMap: {
    uuid: 'string',
    'text[]': 'string[]',
    jsonb: 'string',
    float8: 'number',
    numeric: 'string',
  },
  schemas: [
    {
      name: 'public',
      ignore: ['knex_migrations', 'knex_migrations_lock'],
      modelFolder: path.join(__dirname, '../src/daos/types/database'),
    },
  ],
}
