import { Pool } from 'pg'

const {
  PG_HOST,
  PG_DATABASE,
  PG_USER,
  PG_PASSWORD,
  PG_PORT,
  PG_MAX,
  PG_IDLETIMEOUT,
  PG_CONNECTIONTIMEOUT,
} = process.env

export const db = new Pool({
  host: PG_HOST,
  database: PG_DATABASE,
  user: PG_USER,
  password: PG_PASSWORD,
  port: Number(PG_PORT),
  max: Number(PG_MAX),
  idleTimeoutMillis: Number(PG_IDLETIMEOUT),
  connectionTimeoutMillis: Number(PG_CONNECTIONTIMEOUT),
  ssl: {
    rejectUnauthorized: false,
  },
})
