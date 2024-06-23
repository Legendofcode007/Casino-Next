import { Connection, createPool, Pool } from "mysql2/promise";
import getConfig from 'next/config'

const { serverRuntimeConfig } = getConfig()

let client: Pool | undefined = undefined;

export async function connectToDatabase(): Promise<Pool> {
  if (client) return client;

  client = await createPool({
    host: serverRuntimeConfig.DB_HOST,
    port: serverRuntimeConfig.DB_PORT,
    user: serverRuntimeConfig.DB_USER,
    password: serverRuntimeConfig.DB_PWD,
    database: serverRuntimeConfig.DB,
    waitForConnections: true,
    connectionLimit: 30,
    queueLimit: 0,
  });

  return client;
}

export const runTransaction =  (pool:Pool) => async <T = unknown>(f: (conn:Connection) => Promise<T> ) => {
  const conn = await  pool.getConnection();
  try {
    await conn.beginTransaction();
    const res = await f(conn);
    await conn.commit();
    conn.release();
    return res;
  }catch(err) {
    await conn.rollback();
    conn.release();
    throw err;
  } 
}