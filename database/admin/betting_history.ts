import { Connection } from "mysql2/promise";
import { BettingResult } from "../../entities/betting_history";
import { addDays,format} from 'date-fns'
import { User } from "../../entities/user";

export type AdminGetBettingHistoriesAndCountQuery = {
  filter: {
    q?: string;
    start_date?: string,
    end_date?: string,
    result?: BettingResult
  };
  limit: number;
  skip: number;
  sort?: [string,string]
}

export const adminGetBettingHistoriesAndCount = (conn: Connection) => async ({filter = {},limit,skip,sort}: AdminGetBettingHistoriesAndCountQuery): Promise<{results:User[],count:number}> => {
  let limits = limit;
  let offset = skip;

  let filters = [];
  
  if(filter.q) {
    filters.push(`u.name like ${conn.escape('%'+filter.q+'%')} or u.nick_name like ${conn.escape('%'+filter.q +'%')}`)
  }
  if(filter.start_date) {
    filters.push(`bh.date >= ${conn.escape(filter.start_date)}`)
  }
  if(filter.end_date) {
    const end_date = format(addDays(new Date(filter.end_date),1),'yyyy-MM-dd') 

    filters.push(`bh.date < ${conn.escape(end_date)}`)
  }
  if(filter.result) {
    filters.push(`bh.result = ${conn.escape(filter.result)}`)
  }

  const filterString = filters.join(' AND ');
  const sortString = sort?.length  ? `order by ${conn.escapeId('bh.'+sort[0])} ${sort[1]}`:''
  let where = `${filterString.length ? 'WHERE '+filterString:''}`;
  let fromAndJoin = `FROM betting_history as bh 
                     INNER JOIN users as u
                     ON u.id=bh.user_id`;

  const sql = `SELECT bh.*,u.name,u.nick_name,u.email,u.role,u.balance
    ${fromAndJoin}
    ${where} ${sortString} LIMIT ? OFFSET ?`;

  const [rows] = await conn.query(sql, [limits, offset]) as any[];

  const [counts] = await conn.query(`SELECT count(*) as total ${fromAndJoin} ${where}`);

  return {
    results: rows ?? [],
    count: (counts as any[])?.[0]?.total ?? 0
  };
}