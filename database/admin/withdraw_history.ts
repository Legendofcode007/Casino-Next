import { Connection, ResultSetHeader } from "mysql2/promise";
import SQL from "sql-template-strings";
import { WithdrawHistoryStatus } from "../../entities/withdraw_hisotry";
import { User } from "../../entities/user";
import { format,addDays } from 'date-fns'

export type AdminGetWithdrawHistoriesAndCountQuery = {
  filter: {
    q?: string;
    start_date?: string,
    end_date?: string,
    status?: WithdrawHistoryStatus
  };
  limit: number;
  skip: number;
  sort?: [string,string]
}

export const adminGetWithdrawHistoriesAndCount = (conn: Connection) => async ({filter = {},limit,skip,sort}: AdminGetWithdrawHistoriesAndCountQuery): Promise<{results:User[],count:number}> => {
  let limits = limit;
  let offset = skip;

  let filters = [];
  
  if(filter.q) {
    filters.push(`u.name like ${conn.escape('%'+filter.q+'%')} or u.nick_name like ${conn.escape('%'+filter.q +'%')}`)
  }
  if(filter.start_date) {
    filters.push(`w.created_at >= TIMESTAMP(${conn.escape(filter.start_date)})`)
  }
  if(filter.end_date) {
    const end_date = format(addDays(new Date(filter.end_date),1),'yyyy-MM-dd') 
    filters.push(`w.created_at < TIMESTAMP(${conn.escape(end_date)})`)
  }
  if(filter.status) {
    filters.push(`w.status = ${conn.escape(filter.status)}`)
  }

  const filterString = filters.join(' AND ');

  const sortString = sort?.length  ? `order by ${conn.escapeId('w.'+sort[0])} ${sort[1]}`:''
  let where = `${filterString.length ? 'WHERE '+filterString:''}`;
  let fromAndJoin = `FROM withdraw_history as w 
                     INNER JOIN users as u
                     ON u.id=w.user_id`;

  const sql = `SELECT w.*,u.name,u.nick_name,u.email,u.role,u.balance
    ${fromAndJoin}
    ${where} ${sortString} LIMIT ? OFFSET ?`;

  const [rows] = await conn.query(sql, [limits, offset]) as any[];


  const [counts] = await conn.query(`SELECT count(*) as total ${fromAndJoin} ${where}`);

  return {
    results: rows ?? [],
    count: (counts as any[])?.[0]?.total ?? 0
  };
}

export const updateStatusById = (conn:Connection)=> async (id:number, status: WithdrawHistoryStatus) => {
  const res = await conn.query<ResultSetHeader>(SQL`UPDATE withdraw_history SET status=${status} where id=${id}`);
  
}