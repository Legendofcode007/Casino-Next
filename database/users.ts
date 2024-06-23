import { User } from "../entities/user";
import { connectToDatabase } from "./connection";
import { Connection,  ResultSetHeader, RowDataPacket} from "mysql2/promise"
import { randomBytes } from 'node:crypto'
import { promisify } from 'node:util'
import SQL from "sql-template-strings";

export type CreateUserInput = Pick<User, 
  'email'  
  | 'approved' 
  | 'ip' 
  | 'is_active' 
  | 'name' 
  | 'nick_name' 
  |'role' 
  | 'balance' 
  | 'password' 
  | 'point'
  | 'phone_verified'
  | 'phone'
  
  > 
  
  & Partial<Pick<User, "betting_limit" | "winning_limit">>;

export const createUser = (conn:Connection) => async (data: CreateUserInput) => {
  const referral_code = await promisify(randomBytes)(10)
  const res = await conn.query<ResultSetHeader>('INSERT INTO users SET ?',{
    ...data,
    referral_code: referral_code.toString('hex'),
    created_at: new Date(),
    updated_at: new Date()
  });
  const userId = res?.[0]?.insertId;
  
  return userId;
}

export type UpdateUserInput = Omit<Partial<User>,'id'>;
export const updateOneById = (conn:Connection) => async (id:number,obj:UpdateUserInput) => {
  const updateObj = {
    updated_at: new Date(),
    ...obj
  } 
  const res = await conn.query<ResultSetHeader>('UPDATE users set ? where id = ?', [updateObj,id]);
}

export type UpdateBalanceByUserIdInput =  {
  balance?: {
    amount: string,
    command: '+' | '-'
  },
  point? :{
    amount: string,
    command: '+' | '-'
  }
  
};
export const updateBalanceByUserId = (conn:Connection) => async (id:number,obj:UpdateBalanceByUserIdInput) => {
  if(!Object.keys(obj).length) throw Error('Validate Amount');
  
  let query = SQL`UPDATE users set updated_at=${new Date()}`;
  
  for(const key of (Object.keys(obj) as unknown[] as  (keyof UpdateBalanceByUserIdInput)[])) {
    if(obj[key]?.command=='+') {
      query = query.append(`,${key} = ${key} + ${obj[key]?.amount}`)
    } else {
      query = query.append(`,${key} = ${key} - ${obj[key]?.amount}`)
    }
  }
  query = query.append(` WHERE id = ${id}`)
  const res = await conn.query<ResultSetHeader>(query);

}

export const findOneById = (conn:Connection) => async (id: number) => {
  const [rows] = await conn.query<RowDataPacket[]>("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);

  return rows?.[0] as User;
}

export const findOneByReferralCode = (conn:Connection) => async (referral_code: string) => {
  const [rows] = await conn.query<RowDataPacket[]>(SQL`SELECT * FROM users WHERE referral_code=${referral_code} LIMIT 1`);

  return rows?.[0] as User | undefined;
}


export const UpdatePointToBalanceByUserId = (conn:Connection) => async (id:number) => {
  const [rows] = await conn.query<RowDataPacket[]>(SQL`UPDATE users set balance = balance + point, point = '0' WHERE id=${id}`);
}

export const findOneUserById = async (id: number) => {
  let client = await connectToDatabase();

  const [rows] = await client.query(
    "SELECT * FROM users WHERE id = ?", [id]);

  return rows;

};


export const findOneByEmail = (conn: Connection) => async (email:string) => {
  const [rows] = await conn.query<RowDataPacket[]>("SELECT *  FROM users where email = ?", [email]);

  return rows?.[0] as User;
}

export const findOneByNickname = (conn: Connection) => async (nickname: string) => {
  const [rows] =  await conn.query<RowDataPacket[]>("SELECT * FROM users where nick_name = ? limit 1", [nickname]);

  return rows?.[0] as User;
}

export const UpdateLastLoginById = (conn: Connection) => async (id: number, last_login?: Date) => {
  await conn.query<ResultSetHeader>("UPDATE users SET last_login = ?  WHERE id = ?", [last_login ?? Date.now(),id]);
}


export const findAdminUser = async () => {
  let client = await connectToDatabase();

  const [rows] = await client.query(
    "SELECT * from users where role = 'admin'");
    
  return rows;
};

export const findUserByEmail = async (email: string) => {
  let client = await connectToDatabase();

  const [rows] = await client.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  //console.log("rows", rows);
  return rows;
};

export const findUserByNick = async (nick_name: string) => {
  let client = await connectToDatabase();

  const [rows] = await client.query(
    "SELECT id,email,name,nick_name,role FROM users WHERE nick_name = ?",
    [nick_name]
  );

  //console.log(rows);

  return rows;
};

export const findUserById = async (id: number) => {
  let client = await connectToDatabase();

  console.log('findUserById')

  const [rows] = await client.query(
    "SELECT * FROM users WHERE id = ?", [id]);

  return rows;

};

export const getUserDetails = async (id: number) => {
  let client = await connectToDatabase();

  const [rows] = await client.query(
    "SELECT users.*, user_permissions.controller_nick_name, user_permissions.controller_type, banks.bank_name, banks.bank_address, banks.acc_name, banks.acc_num FROM users LEFT JOIN user_permissions ON users.id=user_permissions.user_id LEFT JOIN balance ON users.id=balance.user_id LEFT JOIN banks ON users.id=banks.user_id WHERE users.id = ?", [id]);
  

  return rows;

};

export const insertUser = async (obj) => {
  let client = await connectToDatabase();

  const insert = await client.query("INSERT INTO users SET ?", obj);

  return insert[0].insertId;

};

export const updateUser = async (id, obj) => {
  let client = await connectToDatabase();

  await client.query("UPDATE users SET ? WHERE id = " + id, obj);

  return "success";
};


export const updateUserPassword = async (email: string, obj: object) => {
  let client = await connectToDatabase();

  await client.query("UPDATE users SET ? WHERE email = " + email, obj);

  //client.end();

  return "success";
};


export const findUserAccount = async (id: number) => {
  
  let client = await connectToDatabase();

  let sql = SQL`SELECT users.*, banks.id as bank_id,banks.bank_name,banks.acc_name,banks.acc_num,banks.created_at as bank_created 
    FROM users 
    LEFT JOIN banks ON users.id=banks.user_id  
    WHERE users.id = ${id}`;
  

  const [rows] = await client.query(sql);

  return rows;

};

