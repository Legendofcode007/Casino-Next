import { Connection, Pool, ResultSetHeader } from 'mysql2/promise'
import { connectToDatabase } from "./connection";
import { UserPermission } from '../entities/user';

export const insertPermission = async (obj) => {
  let client = await connectToDatabase();

  const insert = await client.query("INSERT INTO user_permissions SET ?", obj);

  return insert[0].insertId;

};

export const getPermissionByReseller = async (id) => {
  let client = await connectToDatabase();

  const rows = await client.query("SELECT user_id from user_permissions where controller_id = "+id);

  return rows[0];

};

export const getPermissionByUserId = async (userId) => {
  let client = await connectToDatabase();

  const rows = await client.query("SELECT user_type as role, controller_id as reseller_id from user_permissions where user_id = "+userId);

  return rows[0];

};

export const findOneByUserId =  (conn: Connection) => async (id:number) => {
  const [rows] = await conn.query("SELECT * from user_permissions where user_id = ? limit 1", [id] );

  return (rows as any)?.[0];
}

export const findOneByControllerId = (conn: Connection) => async (id:number) => {
  const [rows] = await conn.query('SELECT * from user_permissions where controller_id = ?', [id]);

  return (rows as any)?.[0];
}


export type CreatePermissionInput = Pick<UserPermission, 'controller_id' | 'user_id'>;

export const createPermission = (conn: Connection) => async (input:CreatePermissionInput) => {
  const result = await conn.query<ResultSetHeader>('INSERT INTO user_permissions SET ?', input);

  return result?.[0]?.insertId;
}