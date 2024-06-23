import { connectToDatabase } from "./connection";
import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise"
import { Bank } from "../entities/bank"
import SQL from "sql-template-strings";

export const findOneByUserId =  (conn: Connection) => async (id:number) => {
  const [rows] = await conn.query("SELECT * from banks where user_id = ? limit 1", [id] );

  return (rows as any)?.[0] as Bank | undefined;
}

export type CreateBankInput = Pick<Bank, 'acc_name' | 'acc_num'  | 'bank_name' | 'user_id' >

export const createBank = (conn: Connection) => async (input:CreateBankInput) => {
  const result = await conn.query<ResultSetHeader>("INSERT INTO banks SET ? ", input);

  return result[0].insertId;
}

export type UpdateBankInput = Pick<CreateBankInput, "acc_name" | "acc_num" | "bank_name">
export const updateOnebyUserId = (conn:Connection) => async(id:number, input:UpdateBankInput) => {
  const bank = await findOneByUserId(conn)(id);
  if(!bank){
    await createBank(conn)({
      ...input,
      user_id:id
    });
  }else {
    await conn.query<ResultSetHeader>(SQL`UPDATE banks 
      SET acc_num=${input.acc_num},acc_name=${input.acc_name},bank_name=${input.bank_name}
      WHERE user_id=${id}
    `)
  }
   
}

export const insertBank = async (obj) => {
  let client = await connectToDatabase();

  const insert = await client.query("INSERT INTO banks SET ?", obj);

  return insert[0].insertId;

};

export const updateBank = async (id, obj) => {
  let client = await connectToDatabase();

  await client.query("UPDATE banks SET ? WHERE user_id = " + id, obj);

  return "success";
};

export const findBankbyId = async (id) => {

  let client = await connectToDatabase();

  const [rows] = await client.query<RowDataPacket[]>(
    "SELECT * FROM banks WHERE user_id = ?", [id]);

  return rows;

}