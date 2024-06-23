import { connectToDatabase } from "./connection";
import { BannedInfo } from "../entities/user"
import { Pool, RowDataPacket,Connection } from "mysql2/promise";
import SQL from "sql-template-strings";


export type ToggleBannByUserIdInput = {
  user_id: number;
  ip?: string;
  banned_by_id: number;
}
export const toggleBannByUserid = (conn:Pool) => async (input:ToggleBannByUserIdInput) => {
  
  const bannd = await findOneByUserId(conn)(input.user_id);
  if(bannd) {
    await conn.query(`DELETE FROM banned_users WHERE user_id = ?`,[input.user_id])
  } else {
    await conn.query('INSERT INTO banned_users SET ?', input);
  }

}

export const findOneByUserId = (conn: Connection) => async (id: number) => {
  const [rows] = await conn.query<RowDataPacket[]>(
    "SELECT * FROM banned_users WHERE user_id = ? limit 1", [id]);

  return (rows as any)?.[0] as BannedInfo | undefined;
}

export const hasBannedIPOrUserId = (conn:Pool) => async (ip: string,userId?:number) => {
  let query = SQL`SELECT COUNT(*) as count FROM banned_users WHERE ip=${ip}`;
  if(userId) {
    query = query.append(`AND user_id=${userId}`)
  }
  console.log(query);
  const [rows] = await conn.query<RowDataPacket[]>(query);
  console.log(rows);
  const count = rows?.[0]?.count ?? 0;

  return !!count;
}