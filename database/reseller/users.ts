import { Pool } from "mysql2/promise";
import * as BanndUserDB from "../banned_users";
import * as UserPermissionDB from "../user_permissions";
import * as BankDB from "../banks";
import * as BettingStatisticsDB from '../betting_statistics';
import { ExcluedSuperAdminUserRole, User } from "../../entities/user";
import {format} from 'date-fns';

export type AdminGetUsersAndCountQuery = {
  filter: {
    q?: string;
    isBanned?: boolean;
    isApproved?: boolean;
    role?: ExcluedSuperAdminUserRole,
    start_date?: string,
    end_date?:string,
    reseller_id?: number,
  };
  limit: number;
  skip: number;
  sort?: [string,string]
}

export const adminGetUsersAndCount = (conn: Pool) => async ({filter,limit,skip,sort}: AdminGetUsersAndCountQuery): Promise<{results:User[],count:number}> => {
  let limits = limit;
  let offset = skip;

  let filters = [];
  
  

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
    row.bank_info = await BankDB.findOneByUserId(conn)(row.id);
    row.banned_info = await BanndUserDB.findOneByUserId(conn)(row.id);
    row.permission_info = await UserPermissionDB.findOneByUserId(conn)(row.id);
    const statistics = await BettingStatisticsDB.caculateStaticsticDateRange(conn)({
      end_date: filter.end_date ?? format(new Date(),'yyyy-MM-dd'),
      start_date: filter.start_date ?? format(new Date(),'yyyy-MM-dd'),
      user_ids: [row.id]
    })
    row.betting_statistic = statistics[0]
  }


  const [counts] = await conn.query(`SELECT count(u.id) as total ${fromAndJoin} ${where}`);

  return {
    results: rows ?? [],
    count: (counts as any[])?.[0]?.total ?? 0
  };
}