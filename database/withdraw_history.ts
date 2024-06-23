import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { connectToDatabase } from "./connection";
import SQL from "sql-template-strings";
import { WithdrawHistory } from "../entities/withdraw_hisotry";
import { subDays } from "date-fns"

export const findOneById = (conn:Connection) => async (id:number) => {
  const [rows] = await conn.query<RowDataPacket[]>(SQL`SELECT w.*,u.balance,u.email
    from withdraw_history as w
    LEFT jOIN users as u
    ON u.id=w.user_id
    where w.id=${id}`);

  return rows?.[0] as WithdrawHistory | undefined
}

export type CreateRequestHistoryInput = Pick<WithdrawHistory, "acc_name" | "acc_num" | "bank_name" | "user_id" | "withdraw_amount" | "balance_before" | "role"  | "nick_name">

export const createWithdrawHistory = (conn:Connection) => async (obj: CreateRequestHistoryInput) => {
  const [res] = await conn.query<ResultSetHeader>("INSERT INTO withdraw_history SET ?", obj);

  return res.insertId;
}




export const getRecentlyWithdrawHistoryByUser =(conn:Connection) => async (id:number) => {
  const today = new Date();
  const start_date = subDays(today,4);
  const [ rows ]= await conn.query(
    SQL`
      SELECT wh.* 
      FROM withdraw_history as wh
      INNER JOIN users ON users.id = wh.user_id 
      WHERE wh.user_id = ${id} AND wh.created_at between ${start_date} and ${today} 
      order by id desc
    `);
   
  return rows as WithdrawHistory[];
};




export const getWithdrawDetails = async (id: number) => {
  let client = await connectToDatabase();

  const [rows] = await client.query(
    "SELECT withdraw_history.*, users.email FROM withdraw_history LEFT JOIN users ON users.id = withdraw_history.user_id WHERE withdraw_history.id = ?", [id]);
  return rows;

};




export const getWithdrawHistory = async () => {
  let client = await connectToDatabase();

  const rows= await client.query(
    SQL`SELECT 
      nick_name, created_at, withdraw_amount 
    FROM withdraw_history 
    WHERE status='success'
    order by id desc LIMIT 5 OFFSET 0`);
  
  return rows[0];

};