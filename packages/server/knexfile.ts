import 'dotenv/config'
import type {Knex} from 'knex'

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 25432,
    user: process.env.DB_USER || 'secondpiece',
    password: process.env.DB_PASSWORD || 'secondpiece',
    database: process.env.DB_NAME || 'secondpiece',
  },
  migrations: {
    directory: './src/migrations',
    extension: 'ts',
  },
}

export default config
