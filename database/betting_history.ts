import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { connectToDatabase } from "./connection";
import { BettingResult, BettingHistory } from "../entities/betting_history";
import { subDays } from 'date-fns'
import SQL from "sql-template-strings";

export type FindOneQuery = {
  transaction_id?: BettingHistory["transaction_id"]
  user_id?: BettingHistory["user_id"]
  result?: BettingHistory["result"]
}

export const findOne = (conn:Connection) => async (query: FindOneQuery) => {
  const keys = ["transaction_id","user_id","result"] as (keyof FindOneQuery)[];
  const where = keys
    .filter(key=>Object.hasOwn(query,key))
    .map((key)=> `${conn.escapeId(key)} = ${conn.escape(query[key])}`).join(' AND ')
  const [rows] = await conn.query<RowDataPacket[]>(`SELECT * FROM betting_history WHERE ${where} limit 1`);

  return rows?.[0] as BettingHistory | null;
}


export type CreateBettingHistoryInput = Omit<BettingHistory, "id">

export const createBettingHistory = (conn: Connection) => async (input: CreateBettingHistoryInput) => {

  const res = await conn.query<ResultSetHeader>('INSERT INTO betting_history SET ? ', input);

  return res[0].insertId
}


export type GetRecentlyBettingHistoryInput = {
  user_id: number
}

export const getRecentlyBettingHistory = (conn: Connection) => async (input:GetRecentlyBettingHistoryInput) => {
  const today = new Date();
  const start_date = subDays(today,4);

  const [ rows ]= await conn.query<RowDataPacket[]>(
    SQL`SELECT * 
    FROM betting_history 
    where user_id=${input.user_id} and date between ${start_date} and ${today} 
    ORDER BY id desc`
  )

  return rows as BettingHistory[]
};

export const insertBetting = async (obj) => {
  
  let client = await connectToDatabase();

  const insert = await client.query("INSERT INTO betting_history SET ?", obj);

  return insert[0].insertId;

};

export const updateBetting = async (id, obj) => {
  let client = await connectToDatabase();

  await client.query("UPDATE betting_history SET ? WHERE user_id = " + id, obj);

  return "success";
};

export const updateBettingByTransId = async (trans_id, obj) => {
  let client = await connectToDatabase();

  await client.query("UPDATE betting_history SET ? WHERE transaction_id = " + trans_id, obj);

  return "success";
};


export const findBettingbyTransId = async (trans_id) => {

  let client = await connectToDatabase();

  const [rows] = await client.query(
    "SELECT * FROM betting_history WHERE transaction_id = ?", [trans_id]);

  return rows;

}

export const findBettingbyId = async (id) => {

  let client = await connectToDatabase();

  const [rows] = await client.query(
    "SELECT * FROM betting_history WHERE user_id = ?", [id]);

  return rows;

}

export const getBettingHistory = async (
  skip: number,
  user: object,
  sort: string,
  sortBy: string,
  limit: number,
  value: string,
  key: string,
  start: string,
  end: string
) => {

  let client = await connectToDatabase();
  let limits = limit;
  let offset = skip;
  let sql;
  let sorts = sort;
  let sortsBy = sortBy;
  let str = value;
  let column = key;

  if (user.role == 'admin' || user.role == 'super_admin') {

    if (!str) {
      if (start != null)
        sql = "SELECT * FROM betting_history where date between '" + start + "' and '" + end + " 23:59:59.999' order by " + sortsBy + " " + sorts + " LIMIT ?  OFFSET ? ";
      else
        sql = "SELECT * FROM betting_history order by " + sortsBy + " " + sorts + " LIMIT ?  OFFSET ? ";
    }
    else {
      sql = "SELECT * FROM betting_history where " + column + " = '" + str + "' order by " + sortsBy + " " + sorts + " LIMIT ?  OFFSET ? ";
    }

    //console.log('!!!!!!SQL',sql)
      
  }
  else if (user.role == 'reseller') {

    //console.log('user.id',user.id)

    const [childResellers] = await client.query("SELECT user_id FROM user_permissions WHERE controller_id = '" + user.id + "'");

    var child = [];

    for (var i = 0; i < childResellers.length; i++)
      child.push(childResellers[i].user_id);

    child = child.toString();
    //console.log('child',child)

    if (!str) {
    
      if (start != null) {
        sql = "SELECT betting_history.* FROM betting_history ";
        sql += "LEFT JOIN user_permissions ON betting_history.user_id = user_permissions.user_id ";
        sql += "WHERE user_permissions.controller_id='" + user.id + "' AND betting_history.date between '" + start + "' and '" + end + " 23:59:59.999' ";
        sql += " order by betting_history." + sortsBy + " " + sorts + " LIMIT ?  OFFSET ? ";
      }
      else {
        sql = "SELECT betting_history.* FROM betting_history ";
        sql += "LEFT JOIN user_permissions ON betting_history.user_id = user_permissions.user_id ";
        sql += "WHERE user_permissions.controller_id='" + user.id+"'";
        sql += " order by betting_history." + sortsBy + " " + sorts + " LIMIT ?  OFFSET ? ";
      }

    }
    else {

      sql = "SELECT betting_history.* FROM betting_history ";
      sql += "LEFT JOIN user_permissions ON betting_history.user_id = user_permissions.user_id ";
      sql += "WHERE user_permissions.controller_id='" + user.id + "' ";
      sql += "AND betting_history." + column + " = '" + str + "' "
      sql += "order by betting_history." + sortsBy + " " + sorts + " LIMIT ?  OFFSET ? ";
      
    }
    
  }
  
  //console.log(sql)
  const [rows] = await client.query(sql, [limits, offset]);
  return rows;
  
};

export const getCount = async (user: object, value: string,
  key: string, start:string, end:string) => {
  
  let client = await connectToDatabase();
  let sql;
  let str = value;
  let column = key;

  if (user.role == 'super_admin' || user.role == 'admin') {

    if (!str) {
      if (start !=null)
        sql = "SELECT COUNT(id) AS total FROM betting_history where date between '" + start + "' and '" + end + " 23:59:59.999'";
      else
        sql = "SELECT COUNT(id) AS total FROM betting_history";
    }
    else {
      sql = "SELECT COUNT(id) AS total FROM betting_history where " + column + " = '" + str + "' ";
    }

  }
  else if (user.role == 'reseller') {
    
    if (!str) {

      if (start != null) {
        sql = "SELECT COUNT(betting_history.id) AS total FROM betting_history ";
        sql += "LEFT JOIN user_permissions ON betting_history.user_id = user_permissions.user_id ";
        sql += "WHERE user_permissions.controller_id='" + user.id + "' AND betting_history.date between '" + start + "' and '" + end + " 23:59:59.999'";
      }
      else {
        sql = "SELECT COUNT(betting_history.id) AS total FROM betting_history ";
        sql += "LEFT JOIN user_permissions ON betting_history.user_id = user_permissions.user_id ";
        sql += "WHERE user_permissions.controller_id='" + user.id + "' ";
      }

    }
    else {

      sql = "SELECT COUNT(betting_history.id) AS total FROM betting_history ";
      sql += "LEFT JOIN user_permissions ON betting_history.user_id = user_permissions.user_id ";
      sql += "WHERE user_permissions.controller_id='" + user.id + "' ";
      sql += "AND betting_history." + column + " = '" + str + "' "

    }
    
  }

  const [rows] = await client.query(sql);
  return rows;

};

export const getResellerDataCount = async (json: JSON, start: string, end: string) => {
  
  //console.log('getResellerDataCount',start,end)
  
  let client = await connectToDatabase();

  //console.log(json)

  var child = [];

  for (var i = 0; i < json.length; i++)
    child.push(json[i].user_id);

  child = child.toString();
  
  //console.log(child)

  //let sql = "SELECT COUNT(*) as total_games, SUM(amount) as total_amount, result from betting_history where user_id IN(" + child + ")";

  let sql;

  if (start) {
    
    sql = "SELECT COUNT(*) AS total_games, SUM(amount) AS total_amount, ";

    sql += "(SELECT COUNT(*) FROM betting_history WHERE result='won' AND user_id IN(" + child + ") AND betting_history.date between '" + start + "' and '" + end + " 23:59:59.999') AS games_won, ";

    sql += "(SELECT COUNT(*) FROM betting_history WHERE result='lost' AND user_id IN(" + child + ") AND betting_history.date between '" + start + "' and '" + end + " 23:59:59.999') AS games_lost, ";

    sql += "(SELECT SUM(amount) FROM betting_history WHERE result='won' AND user_id IN(" + child + ") AND betting_history.date between '" + start + "' and '" + end + " 23:59:59.999') AS amount_won, ";

    sql += "(SELECT SUM(amount) FROM betting_history WHERE result='lost' AND user_id IN(" + child + ") AND betting_history.date between '" + start + "' and '" + end + " 23:59:59.999') AS amount_lost ";

    sql += "FROM betting_history ";
  
    sql += "WHERE user_id IN(" + child + ") AND betting_history.date between '" + start + "' and '" + end + " 23:59:59.999'";
    
  }

  else {

    sql = "SELECT COUNT(*) AS total_games, SUM(amount) AS total_amount, ";

    sql += "(SELECT COUNT(*) FROM betting_history WHERE result='won' AND user_id IN(" + child + ")) AS games_won, ";

    sql += "(SELECT COUNT(*) FROM betting_history WHERE result='lost' AND user_id IN(" + child + ")) AS games_lost, ";

    sql += "(SELECT SUM(amount) FROM betting_history WHERE result='won' AND user_id IN(" + child + ")) AS amount_won, ";

    sql += "(SELECT SUM(amount) FROM betting_history WHERE result='lost' AND user_id IN(" + child + ")) AS amount_lost ";

    sql += "FROM betting_history ";
  
    sql += "WHERE user_id IN(" + child + ")";

  }

  //console.log(sql);

  const rows = await client.query(sql);
    
  //console.log(rows[0])

  return rows[0]

}



export const getBettingHistoryByReseller = async (
  skip: number,
  limit: number,
  start: string,
  end: string,
  reseller_id:number
) => {

  let client = await connectToDatabase();
  let limits = limit;
  let offset = skip;
  let sql;

  if (start != null)
    sql = "SELECT * FROM betting_history where reseller_id = '"+reseller_id+"' AND date between '" + start + "' and '" + end + " 23:59:59.999' order by id DESC LIMIT ?  OFFSET ? ";
  else
    sql = "SELECT * FROM betting_history where reseller_id = '"+reseller_id+"' order by id DESC LIMIT ?  OFFSET ? ";
  
  //console.log(sql)

  const [rows] = await client.query(sql, [limits, offset]);
  return rows;
  
};

export const getCountByReseller = async (start:string, end:string, reseller_id:number) => {
  
  let client = await connectToDatabase();
  let sql;

  if (start != null)
    sql = "SELECT COUNT(id) AS total FROM betting_history where reseller_id = '"+reseller_id+"' AND date between '" + start + "' and '" + end + " 23:59:59.999'";
  else
    sql = "SELECT COUNT(id) AS total FROM betting_history where reseller_id = '"+reseller_id+"'";

  const [rows] = await client.query(sql);
  return rows;

};