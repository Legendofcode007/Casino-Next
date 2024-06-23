import { Connection, Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise"
import {  User } from "../../entities/user";
import {  DepositHistoryStatus } from "../../entities/deposit_history"
import { SQL } from 'sql-template-strings'
import { addDays,format} from 'date-fns'
export type AdminGetDepositHistoriesAndCountQuery = {
  filter: {
    q?: string;
    start_date?: string,
    end_date?: string,
    status?: DepositHistoryStatus
  };
  limit: number;
  skip: number;
  sort?: [string,string]
}

export const adminGetDepositHistoriesAndCount = (conn: Pool) => async ({filter = {},limit,skip,sort}: AdminGetDepositHistoriesAndCountQuery): Promise<{results:User[],count:number}> => {
  let limits = limit;
  let offset = skip;

  let filters = [];
  
  if(filter.q) {
    filters.push(`u.name like ${conn.escape('%'+filter.q+'%')} or u.nick_name like ${conn.escape('%'+filter.q +'%')}`)
  }
  if(filter.start_date) {
    filters.push(`d.created_at >= TIMESTAMP(${conn.escape(filter.start_date)})`)
  }
  if(filter.end_date) {
    const end_date = format(addDays(new Date(filter.end_date),1),'yyyy-MM-dd') 

    filters.push(`d.created_at < TIMESTAMP(${conn.escape(end_date)})`)
  }
  if(filter.status) {
    filters.push(`d.status = ${conn.escape(filter.status)}`)
  }

  const filterString = filters.join(' AND ');

  const sortString = sort?.length  ? `order by ${conn.escapeId('d.'+sort[0])} ${sort[1]}`:''
  let where = `${filterString.length ? 'WHERE '+filterString:''}`;
  let fromAndJoin = `FROM deposit_history as d 
                     INNER JOIN users as u
                     ON u.id=d.user_id`;

  const sql = `SELECT d.*,u.name,u.nick_name,u.email,u.role,u.balance
    ${fromAndJoin}
    ${where} ${sortString} LIMIT ? OFFSET ?`;

  const [rows] = await conn.query(sql, [limits, offset]) as any[];


  const [counts] = await conn.query(`SELECT count(*) as total ${fromAndJoin} ${where}`);

  return {
    results: rows ?? [],
    count: (counts as any[])?.[0]?.total ?? 0
  };
}
 
export type UpdateDepositHistoryByIDInput = {
  status: DepositHistoryStatus,
  deposit_point?: number
}

export const updateDepositHistoryByID = (conn:Connection)=> async (id:number, input:UpdateDepositHistoryByIDInput) => {
  const res = await conn.query<ResultSetHeader>(SQL`UPDATE deposit_history SET status=${input.status}, deposit_point=${input.deposit_point} where id=${id}`);
  
}