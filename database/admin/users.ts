import { Connection, Pool, RowDataPacket } from "mysql2/promise"
import * as BanndUserDB from "../banned_users"
import * as UserPermissionDB from "../user_permissions"
import * as BankDB from "../banks"
import * as BettingStatisticsDB from '../betting_statistics'
import { ExcluedSuperAdminUserRole, User, UserRole } from "../../entities/user";
import { format } from 'date-fns'
import SQL from "sql-template-strings"


const makeMoreDetail = (conn:Connection) => async (user:User, statisticsInfo?: {start_date:any,end_date:any}) => {
  user.bank_info = await BankDB.findOneByUserId(conn)(user.id);
  user.banned_info = await BanndUserDB.findOneByUserId(conn)(user.id);
  user.permission_info = await UserPermissionDB.findOneByUserId(conn)(user.id);

  if(statisticsInfo) {
    const statistics = await BettingStatisticsDB.caculateStaticsticDateRange(conn)({
      end_date: statisticsInfo.end_date ?? format(new Date(),'yyyy-MM-dd'),
      start_date: statisticsInfo.start_date ?? format(new Date(),'yyyy-MM-dd'),
      user_ids: [user.id]
    })
    user.betting_statistic = statistics[0]
  }
 
  return user;
}

export const findOneById = (conn:Connection) => async(id:number) => {
  const [rows] = await conn.query<RowDataPacket[]>(SQL`SELECT *
    FROM users 
    WHERE id=${id}`)

  if(!rows?.[0]) return undefined;

  return makeMoreDetail(conn)(rows[0] as User)
}

export type AdminGetUsersAndCountQuery = {
  filter: {
    q?: string;
    isBanned?: boolean;
    isApproved?: boolean;
    role?: ExcluedSuperAdminUserRole,
    start_date?: string,
    end_date?:string,
    resller_id?: number,
  };
  limit: number;
  skip: number;
  sort?: [string,string]
}

export const adminGetUsersAndCount = (conn: Pool) => async ({filter = {},limit,skip,sort}: AdminGetUsersAndCountQuery): Promise<{results:User[],count:number}> => {
  let limits = limit;
  let offset = skip;

  let filters = [];
  
  if(filter.q) {
    const q = conn.escape(`%${filter.q.toLocaleLowerCase().trim()}%`)
    filters.push(`lower(u.name) like ${conn.escape(q)} or lower(u.nick_name) like ${conn.escape(q)}`)
  }
  if(typeof filter.isApproved === 'boolean') {
    filters.push(`u.approved='${conn.escape(filter.isApproved ? 1:0)}'`)
  }

  if(filter.role) {
    filters.push(`u.role=${conn.escape(filter.role)}`)
  }
  const filterString = filters.join(' AND');

  console.log(filterString)
  const sortString = sort?.length  ? `order by ${conn.escapeId('u.'+sort[0])} ${sort[1]}`:''
  let where = `${filterString.length ? 'WHERE '+filterString:''}`;
  let fromAndJoin = 'FROM users as u';

  if(filter.isBanned) {
    fromAndJoin += `
      INNER JOIN banned_users as b ON u.id=b.user_id
    `;
  }

  if(filter.resller_id) {
    fromAndJoin += `
      INNER JOIN user_permissions as up ON u.id=up.user_id and up.controller_id=${conn.escape(filter.resller_id)}
    `
  }


  const sql = `SELECT u.* 
    ${fromAndJoin}
    ${where} ${sortString} LIMIT ${conn.escape(limits)} OFFSET ${conn.escape(offset)}`;

  const [rows] = await conn.query(sql) as any[];

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
 
export type SearchNameOrNicknameQuery = {
  searh: string,
  role?: UserRole
}
export const searchNameOrNickname = (conn:Connection) => async(query:SearchNameOrNicknameQuery) => {
  
  if(!query.searh) return [];
  const search ='%'+query.searh.trim()+'%'
  let where = `WHERE name like ${conn.escape(search)} or nick_name like ${conn.escape(search)}`;
  if(query.role) where += ` AND role=${query.role}`;

  const [rows] = await conn.query<RowDataPacket[]>(`SELECT * FROM users ${where} LIMIT 20`);
  
  return rows as User[]
}
