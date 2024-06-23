import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { BettingStatistics } from "../entities/betting_statistics";
import {
  BigNumber
} from 'bignumber.js'
import SQL from "sql-template-strings";
import { GameType } from "../entities/betting_history";


const DB = 'betting_statistics';

const getDateString = (date:Date) => date.toISOString().split("T")[0];


export type FindOneQuery = Pick<BettingStatistics,"user_id" | "game_type"> & {
    date: Date,
}

export const findOne = (conn: Connection) => async (query: FindOneQuery) => {
  const date = getDateString(query.date);

  const [rows] = await conn.query<RowDataPacket[]>(
    SQL`SELECT * FROM `.append(DB).append(SQL` WHERE user_id = ${query.user_id} and game_type=${query.game_type} and date = ${date} limit 1`)
  );


  return rows?.[0] as BettingStatistics | null;
}

/**
 * 기간 날짜내의 해당 유저의 통계 계산하는 api
 * @param conn 
 * @returns 
 */

export type CaculateStaticsticDateRangeQuery = {
    user_ids: [number],
    start_date: string,
    end_date: string
}
export const caculateStaticsticDateRange = (conn:Connection) => async (query:CaculateStaticsticDateRangeQuery) => {
  const [rows] = await conn.query<RowDataPacket[]>(`SELECT 
        sum(cast(bet_amount as signed)) as bet_amount,sum(cast(win_amount as signed)) as win_amount,sum(cast(lost_amount as signed)) as lost_amount,user_id
        FROM betting_statistics 
        WHERE date >= ? and date <= ? and user_id in (?)
        group by user_id;`,[query.start_date,query.end_date,query.user_ids])
  return rows as Pick<BettingStatistics,"bet_amount" | "lost_amount" | "user_id" | "win_amount">[]
}


/**
 * 기간 날짜내의 해당 유저의 통계 계산하는 api
 * @param conn 
 * @returns 
 */

export type CaculateStaticsticDateRangeByResellerQuery = {
  start_date: string,
  end_date: string,
  reseller_id: number
}
export const caculateStaticsticDateRangeByReseller = (conn:Connection) => async (query:CaculateStaticsticDateRangeByResellerQuery) => {
const [rows] = await conn.query<RowDataPacket[]>(SQL`
  SELECT 
    sum(cast(bs.bet_amount as signed)) as bet_amount,
    sum(cast(bs.win_amount as signed)) as win_amount,
    sum(cast(bs.lost_amount as signed)) as lost_amount,
    bs.game_type as game_type
  FROM betting_statistics bs
  INNER JOIN user_permissions as up
    ON bs.user_id=up.user_id and up.controller_id=${query.reseller_id}
  WHERE date >= ${query.start_date} and date <= ${query.end_date}
  group by bs.game_type`)

return rows as Pick<BettingStatistics,"bet_amount" | "lost_amount" | "win_amount" | "game_type">[]
}



export type CreateBettingStatisticsInput = Omit<BettingStatistics,"id" | "date"> & {
    date: Date
}

export const createBettingStatistics = (conn:Connection) => async (input: CreateBettingStatisticsInput) => {
  const res = await conn.query<ResultSetHeader>(`INSERT INTO ${DB} SET ?`,{
    ...input,
    date: getDateString(input.date)
  })

  return res?.[0].insertId;
}

export type UpdaateBettingStatisticsInput = Partial<Omit<CreateBettingStatisticsInput, 'user_id' | 'date'>>;

export const updateBettingStatics = (conn:Connection) => async (id:number, updateObj: UpdaateBettingStatisticsInput) => {
  await conn.query<ResultSetHeader>(`UPDATE ${DB} SET ? WHERE id = ?`,[{
    ...updateObj
  },id])

  console.log(updateBettingStatics);
}


export type CaculateBettingStaticsInputs = {
    command: '+' | '-',
    field: "bet_amount" | 'win_amount' | 'lost_amount',
    amount: string
}[]

export const caculateBettingStatics = (conn: Connection) => async (query:FindOneQuery, inputs: CaculateBettingStaticsInputs) => {
  const result = await findOne(conn)(query);
    
  const data = inputs
    .reduce((prev,next)=>{
      return {
        ...prev,
        [next.field]: next.command === '+' ? prev[next.field].plus(next.amount):prev[next.field].minus(next.amount)   
      } 
    },{
      bet_amount: new BigNumber(result?.bet_amount ?? 0) ,
      win_amount: new BigNumber(result?.win_amount ?? 0),
      lost_amount: new BigNumber(result?.lost_amount ?? 0)
    })

  const inputData = {
    bet_amount: data.bet_amount.toFixed(0),
    win_amount: data.win_amount.toFixed(0),
    lost_amount: data.lost_amount.toFixed(0)
  }
  if(result) {
    await updateBettingStatics(conn)(result.id, inputData);

  } else {
    await createBettingStatistics(conn)({
      ...inputData,
      ...query
    })
  } 
}