import { Connection, RowDataPacket } from "mysql2/promise";
import { Inbox, InboxStatus } from "../../entities/inbox";
import SQL from "sql-template-strings";
import { z } from "zod";
import { format, addDays } from 'date-fns'

export type AdminGetInboxesAndCountQuery = {
  filter: {
    q?: string;
    start_date?: string,
    end_date?: string,
    status?: InboxStatus
  };
  limit: number;
  skip: number;
  sort?: [string,string]
}

export const adminGetInboxesAndCount = (conn: Connection) => async ({filter = {},limit,skip,sort}: AdminGetInboxesAndCountQuery): Promise<{results:Inbox[],count:number}> => {
  let limits = limit;
  let offset = skip;

  let filters = [];
  
  if(filter.q) {
    filters.push(`u.name like ${conn.escape('%'+filter.q+'%')} or u.nick_name like ${conn.escape('%'+filter.q +'%')}`)
  }
  if(filter.start_date) {
    filters.push(`i.created_at >= TIMESTAMP(${conn.escape(filter.start_date)})`)
  }
  if(filter.end_date) {
    const end_date = format(addDays(new Date(filter.end_date),1),'yyyy-MM-dd') 

    filters.push(`i.created_at < TIMESTAMP(${conn.escape(end_date)})`)
  }
  if(filter.status) {
    filters.push(`i.status = ${conn.escape(filter.status)}`)
  }

  const filterString = filters.join(' AND ');

  const sortString = sort?.length  ? `order by ${conn.escapeId('i.'+sort[0])} ${sort[1]}`:''
  let where = `${filterString.length ? 'WHERE '+filterString:''}`;
  let fromAndJoin = `FROM inbox as i 
                     INNER JOIN users as u
                     ON u.id=i.user_id`;

  const sql = `SELECT i.*,u.name,u.nick_name,u.email,u.role,u.balance
    ${fromAndJoin}
    ${where} ${sortString} LIMIT ? OFFSET ?`;

  const [rows] = await conn.query(sql, [limits, offset]) as any[];


  const [counts] = await conn.query(`SELECT count(*) as total ${fromAndJoin} ${where}`);

  return {
    results: rows ?? [],
    count: (counts as any[])?.[0]?.total ?? 0
  };
}


export type AdminSendAllMaill = Pick<Inbox,"subject" | "message">
export const adminSendAllMail = (conn:Connection) => async ({subject,message}:AdminSendAllMaill) => {
  await conn.query(SQL`
    insert into inbox (user_id,subject,message)
    select u.id,${subject},${message} from users as u where u.role='user' or u.role='reseller'
  `)
};

export type AdminSendToNicknamesMail = Pick<Inbox,"subject" | "message"> & {
  to: string[],
}

export const adminSendToNicknamesMail = (conn:Connection) => async({subject,message,to}:AdminSendToNicknamesMail) =>{
  console.log(subject,message,to)
  await conn.query(SQL`
    insert into inbox (user_id,subject,message)
    select u.id,${subject},${message} from users as u where u.nick_name in (${to})
  `)
}

export type AdminSendMailInput = Pick<Inbox, 'subject' | 'message' > & {
  nick_name: string
}
export const adminSendMail = (conn:Connection) => async({subject,message,nick_name}:AdminSendMailInput)=>{
  await conn.query(SQL`
  insert into inbox (user_id,subject,message)
  select u.id,${subject},${message} from users as u where u.nick_name = ${nick_name}
`)
}
