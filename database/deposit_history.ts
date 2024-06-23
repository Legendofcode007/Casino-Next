import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { connectToDatabase } from "./connection";
import SQL from "sql-template-strings";
import { DepositHistory } from "../entities/deposit_history";
import { subDays } from 'date-fns'

export const findOneById = (conn:Connection) => async (id:number) => {
  const [rows] = await conn.query<RowDataPacket[]>(SQL`SELECT d.*,u.name,u.nick_name,u.email,u.role,u.balance
    from deposit_history as d
    LEFT jOIN users as u
    ON u.id=d.user_id
    where d.id=${id}`);

  return rows?.[0] as DepositHistory
}
  
export type CreateRequestHistoryInput = Pick<DepositHistory, "acc_name" | "acc_num" | "bank_name" | "deposit_amount" | "user_id">
export const createDepositHistory = (conn:Connection) =>  async (obj: CreateRequestHistoryInput) => {
  const [res] = await conn.query<ResultSetHeader>("INSERT INTO deposit_history SET ?", obj);

  return res.insertId;
}



export const getRecentlyDepositHistoryByUser = (conn:Connection) => async (id: number) => {
  const today = new Date();
  const start_date = subDays(today,4);

  const [rows] = await conn.query(
    SQL`SELECT * 
    FROM deposit_history 
    WHERE deposit_history.user_id = ${id} and created_at between ${start_date} and ${today}
    order by id desc
  `);
  
  return rows as DepositHistory[];
};



export const getDepositDetails = async (id: number) => {
  let client = await connectToDatabase();

  const [rows] = await client.query(
    "SELECT deposit_history.*, users.email FROM deposit_history LEFT JOIN users ON users.id = deposit_history.user_id WHERE deposit_history.id = ?", [id]);
  return rows;

};




export const getDepositHistory = async () => {
  let client = await connectToDatabase();

  const rows= await client.query(
    SQL`SELECT d.created_at, d.deposit_amount,u.nick_name
    FROM deposit_history as d
    INNER JOIN users as u
    ON u.id=d.user_id
    where d.status='success'
    order by d.id desc 
    LIMIT 5 OFFSET 0`
  );
  
  return rows[0];

};