import { Connection, Pool } from "mysql2/promise"
import * as BanndUserDB from "../banned_users"
import * as UserPermissionDB from "../user_permissions"
import * as BankDB from "../banks"
import * as RateDB from "../rate"
import * as BettingStatisticsDB from '../betting_statistics'
import { ExcluedSuperAdminUserRole, Reseller, User, UserRole } from "../../entities/user";
import { format } from 'date-fns'
import SQL from "sql-template-strings"


const makeMoreDetail = (conn:Connection) => async (user:Reseller, statisticsInfo?: {start_date:any,end_date:any}) => {
  user.bank_info = await BankDB.findOneByUserId(conn)(user.id);
  user.banned_info = await BanndUserDB.findOneByUserId(conn)(user.id);
  user.rate_info = await RateDB.findRatebyResellerId(conn)(user.id);
  if(statisticsInfo) {
    const statistics = await BettingStatisticsDB.caculateStaticsticDateRangeByReseller(conn)({
      end_date: statisticsInfo.end_date ?? format(new Date(),'yyyy-MM-dd'),
      start_date: statisticsInfo.start_date ?? format(new Date(),'yyyy-MM-dd'),
      reseller_id: user.id
    })
    user.betting_statistic = statistics.reduce((prev,next)=>{
      return {
        ...prev,
        [next.game_type]: next
      }
    },{}) as any
  }
 
  return user;
}

export type AdminGetResellersAndCountQuery = {
  filter: {
    q?: string;
    isBanned?: boolean;
    isApproved?: boolean;
    role?: ExcluedSuperAdminUserRole,
    start_date?: string,
    end_date?:string
  };
  limit: number;
  skip: number;
  sort?: [string,string]
}

export const adminGetResellersAndCount = (conn: Pool) => async ({filter = {},limit,skip,sort}: AdminGetResellersAndCountQuery): Promise<{results:User[],count:number}> => {
  let limits = limit;
  let offset = skip;

  let filters = [];
  
  filters.push(`u.role='reseller'`);
  if(filter.q) {
    const q = conn.escape(`%${filter.q.toLocaleLowerCase().trim()}%`)
    filters.push(`lower(u.name) like ${q} or lower(u.nick_name) like ${q}`)
  }
  if(typeof filter.isApproved === 'boolean') {
    filters.push(`u.approved='${filter.isApproved}'`)
  }
  const filterString = filters.join(' AND');

  const sortString = sort?.length  ? `order by ${conn.escapeId('u.'+sort[0])} ${sort[1]}`:''
  let where = `${filterString.length ? 'WHERE '+filterString:''}`;
  let fromAndJoin = 'FROM users as u';

  if(filter.isBanned) {
    fromAndJoin += `
      INNER JOIN banned_users as b ON u.id=b.user_id
    `;
  }

  const sql = `SELECT u.* 
    ${fromAndJoin}
    ${where} ${sortString} LIMIT ? OFFSET ?`;

  const [rows] = await conn.query(sql, [limits, offset]) as any[];

  for(const row of (rows as User[])) {
    await makeMoreDetail(conn)(row, {
      end_date:filter.end_date,
      start_date:filter.start_date
    })
  }


  const [counts] = await conn.query(`SELECT count(u.id) as total ${fromAndJoin} ${where}`);

  return {
    results: rows ?? [],
    count: (counts as any[])?.[0]?.total ?? 0
  };
}
 