import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { BettingStatistics } from "../entities/betting_statistics";
import {
  BigNumber
} from 'bignumber.js'
import { format } from 'date-fns'
import SQL from "sql-template-strings";

const DB = 'betting_statistics';


/**
 * 오늘 전체 유저의 통계
 * @param conn 
 * @returns 
 */

export const getTodayStatistic = (conn:Connection) => async () => {
  const today = format(new Date(),'yyyy-MM-dd')
  const [rows] = await conn.query<RowDataPacket[]>(SQL`SELECT 
      sum(cast(bet_amount as signed)) as bet_amount,sum(cast(win_amount as signed)) as win_amount,sum(cast(lost_amount as signed)) as lost_amount,date
      FROM betting_statistics 
      WHERE date = ${today}
      group by date`)
  return rows as Pick<BettingStatistics,"bet_amount" | "lost_amount" | "user_id" | "win_amount">[]
}
