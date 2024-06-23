import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { connectToDatabase } from "./connection";
import SQL from "sql-template-strings";
import { DepositHistory } from "../entities/deposit_history";
import { skip } from "node:test";
import { BettingHistory } from "../entities/betting_history";
import { CustomerServiceEntity } from "../entities/customer_services";
import { subDays } from 'date-fns'

export const findOneById = (conn:Connection) => async (id:number) => {
  const [rows] = await conn.query<RowDataPacket[]>(SQL`SELECT *
    from customer_services
    where id=${id}`);

  return rows?.[0] as CustomerServiceEntity | null
}



  
export type CreateCustomerServiceInput = Pick<CustomerServiceEntity, "title" | "description" | 'user_id'>
export const createCustomerService = (conn:Connection) =>  async (obj: CreateCustomerServiceInput) => {
  const [res] = await conn.query<ResultSetHeader>("INSERT INTO customer_services SET ?", obj);

  return res.insertId;
}


export type GetRecentlyCustomerServicesInput = {
  user_id: number
}
export const getRecentlyCustomerServices= (conn:Connection) => async (input:GetRecentlyCustomerServicesInput) => {
  const [rows] = await conn.query<RowDataPacket[]>(
    SQL`
    SELECT * 
    FROM customer_services
    WHERE user_id = ${input.user_id}
    ORDER BY id desc
    `
  )

  return rows as CustomerServiceEntity[]
}






