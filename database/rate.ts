import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Rate } from "../entities/rate";
import { connectToDatabase } from "./connection";

export type CreateRateInput = Pick<Rate, 'casino_ggr' | 'casino_rolling' | 'slot_ggr' | 'slot_rolling' | 'reseller_id'>;

export const createRate = (conn: Connection) =>async (input:CreateRateInput) => {
  const result = await conn.query<ResultSetHeader>('INSERT INTO rate SET ?', input);

  return result?.[0]?.insertId;
}

export type UpdateOneRateByUserIdInput = Partial<Pick<CreateRateInput, "casino_ggr" | "casino_rolling" | "slot_ggr" | "slot_rolling">>
export const updateOneRateByUserId = (conn: Connection) => async (userId:number,input: UpdateOneRateByUserIdInput) => {
  const rate = await findOneByUserId(conn)(userId);
  if(!rate) {
    createRate(conn)({
      casino_ggr: input.casino_ggr ?? 0,
      casino_rolling: input.casino_rolling ?? 0,
      slot_ggr: input.slot_ggr ?? 0,
      slot_rolling: input.slot_rolling ?? 0,
      reseller_id: userId
    })
  } else {
    await conn.query("UPDATE rate SET ? WHERE reseller_id = ?",[input,userId]);
  }
}

export const findOneByUserId = (conn:Connection) => async (userid:number) => {

  const [rows] = await conn.query<RowDataPacket[]>(
    "SELECT * FROM rate WHERE reseller_id = ?", [userid]);

  return rows?.[0] as Rate | null;
} 

export const findRatebyResellerId = (conn:Connection) => async (reseller_id:number) => {

  const [rows] = await conn.query<RowDataPacket[]>(
    "SELECT * FROM rate WHERE reseller_id = ?", [reseller_id]);

  return rows?.[0] as Rate | undefined;
} 

export const insertRate = async (obj) => {
  let client = await connectToDatabase();

  const insert = await client.query("INSERT INTO rate SET ?", obj);

  return insert[0].insertId;

};

export const updateRate = async (id, obj) => {
  let client = await connectToDatabase();

  await client.query("UPDATE rate SET ? WHERE reseller_id = " + id, obj);

  return "success";
};

export const findRatebyReseller = async (id) => {

  let client = await connectToDatabase();

  const [rows] = await client.query(
    "SELECT * FROM rate WHERE reseller_id = ?", [id]);

  return rows;

}