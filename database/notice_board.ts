import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { connectToDatabase } from "./connection";
import { NoticeBoard } from "../entities/notice_board";
import { SQL } from 'sql-template-strings'
export const getNotice = async (
  skip: number,
  user: object,
  sort: string,
  sortBy: string,
  limit: number,
  value: string,
  key: string
) => {
  let client = await connectToDatabase();
  let limits = limit;
  let offset = skip;
  let sql;
  let sorts = sort;
  let sortsBy = sortBy;
  //let str = value;
  //let column = key;

  //if(!str)
  sql = "SELECT * FROM notice_board order by " + sortsBy + " " + sorts + " LIMIT ?  OFFSET ? ";
  //else
  //sql = "SELECT * FROM users where role!='super_admin' AND " + column + " LIKE '" + str + "%' order by " + sortsBy + " " + sorts + " LIMIT ?  OFFSET ? ";
  
  const rows = await client.query(sql, [limits, offset]);
    
  //console.log(rows[0])
    
  return rows[0];
  
};

export type CreateNoticeInput = Pick<NoticeBoard, "message" | "subject">;

export const createNotice = (conn:Connection) => async (input:CreateNoticeInput) => {
  const [result] = await conn.query<ResultSetHeader>(SQL`INSERT INTO notice_board set message=${input.message},subject=${input.subject}`)

  return result?.insertId
}

export const getAllNoticeCount = (conn:Connection) => async () => {
  let sql = SQL`SELECT COUNT(id) AS count FROM notice_board`;
  
  const [rows] = await conn.query<RowDataPacket[]>(sql);
  return rows?.[0]?.count ?? 0;
}

export const insertNotice = async (obj: JSON) => {
  
  let client = await connectToDatabase();
    
  const insert = await client.query("INSERT INTO notice_board SET ?", obj);

  return insert[0].insertId;

};

export const getCount = async () => {
  
  let client = await connectToDatabase();
  
  let sql = "SELECT COUNT(id) AS total FROM notice_board";
  
  const rows = await client.query(sql);
  return rows[0];
    
};


export const findNoticeById = async (id: number) => {
  let client = await connectToDatabase();

  const [rows] = await client.query(
    "SELECT * FROM notice_board WHERE id = ?", [id]);

  return rows;

};


export const updateNotice = async (id:number,obj:JSON) => {
    
  let client = await connectToDatabase();
    
  await client.query("UPDATE notice_board SET ? WHERE id = " + id, obj);
    
  return 'success';

}

export const getAllNotice = async () => {
  
  let client = await connectToDatabase();

  let sql = "SELECT * FROM notice_board order by id desc";

  const rows = await client.query(sql);
  //console.log(rows[0]);
    
  return rows[0];
  
};

export const getNoticeHistory = async () => {
  let client = await connectToDatabase();

  const rows= await client.query(
    "SELECT subject, created_at FROM notice_board order by id desc LIMIT 10 OFFSET 0");
  
  return rows[0];

};