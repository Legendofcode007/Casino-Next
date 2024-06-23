import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { connectToDatabase } from "./connection";
import SQL from "sql-template-strings";
import { Inbox } from "../entities/inbox";
import { subDays } from 'date-fns'

export const unreadCountByUserId = (conn:Connection) => async (user_id:number) => {
  const today = new Date();
  const start_date = subDays(today,4);
  let sql = SQL`SELECT COUNT(*) as unread FROM inbox WHERE user_id = ${user_id} and created_at between ${start_date} and ${today} and status='unread'`;
  
  const [rows] = await conn.query<RowDataPacket[]>(sql);

  return rows?.[0]?.unread ?? 0;
}  


export const getRecentlyInboxByUserId = (conn:Connection) => async (user_id:number)=> {
  const today = new Date();
  const start_date = subDays(today,4);

  const [rows] = await conn.query(
    SQL`SELECT * 
    FROM inbox 
    WHERE user_id = ${user_id} and created_at between ${start_date} and ${today}
    order by id desc
  `);
  
  return rows as Inbox[];
}

export type DeleteManyInput = {
  ids: number[],
  user_id: number;
}
export const deleteMany = (conn:Connection) => async (input:DeleteManyInput) => {
  let sql = SQL`DELETE FROM inbox where id in (?) and user_id = ${input.user_id}`;
  
  await conn.query<RowDataPacket[]>(sql,[input.ids]);
}

export type CreateInboxInput = Omit<Inbox,'id' | 'created_at' | 'status'>

export const createInbox = (conn:Connection) => async (input:CreateInboxInput) => {
  const insert = await conn.query<ResultSetHeader>("INSERT INTO inbox SET ?", input);

  return insert[0].insertId;
}


export type ReadInboxByUserIdProps = {
  id:number,
  user_id:number
}
export const readInboxByUserId = (conn:Connection) => async (input:ReadInboxByUserIdProps) => {
  await conn.query<ResultSetHeader>(SQL`UPDATE inbox SET status='read' where id=${input.id} and user_id=${input.user_id} `);

}