import { Connection, RowDataPacket } from "mysql2/promise";
import { addDays,format} from 'date-fns'
import { User } from "../../entities/user";
import SQL from "sql-template-strings";
import { CustomerServiceEntity, CustomerServiceStatus } from "../../entities/customer_services";


export const adminUnreadCount = (conn:Connection) =>  async () => {
  let sql = SQL`SELECT COUNT(*) as count FROM customer_services WHERE status='pending'`;

  const [rows] = await conn.query<RowDataPacket[]>(sql);

  return rows?.[0]?.count ?? 0;
}


export type AdminGetCustomerServicesAndCountQuery = {
  filter: {
    q?: string;
    start_date?: string,
    end_date?: string,
    status?: CustomerServiceStatus
  };
  limit: number;
  skip: number;
  sort?: [string,string]
}

export const adminGetCustomerServicesAndCount = (conn: Connection) => async ({filter = {},limit,skip,sort}: AdminGetCustomerServicesAndCountQuery): Promise<{results:User[],count:number}> => {
  let limits = limit;
  let offset = skip;

  let filters = [];
  
  if(filter.q) {
    filters.push(`u.name like ${conn.escape('%'+filter.q+'%')} or u.nick_name like ${conn.escape('%'+filter.q +'%')}`)
  }

  if(filter.start_date) {
    filters.push(`cs.created_at >= TIMESTAMP(${conn.escape(filter.start_date)})`)
  }
  if(filter.end_date) {
    const end_date = format(addDays(new Date(filter.end_date),1),'yyyy-MM-dd') 

    filters.push(`cs.created_at < TIMESTAMP(${conn.escape(end_date)})`)
  }

  if(filter.status) {
    filters.push(`cs.status = ${conn.escape(filter.status)}`)
  }

  const filterString = filters.join(' AND ');

  const sortString = sort?.length  ? `order by ${conn.escapeId('cs.'+sort[0])} ${sort[1]}`:''
  let where = `${filterString.length ? 'WHERE '+filterString:''}`;
  let fromAndJoin = `FROM customer_services as cs 
                     INNER JOIN users as u
                     ON u.id=cs.user_id`;

  const sql = `SELECT cs.*,u.name,u.nick_name,u.email,u.name
    ${fromAndJoin}
    ${where} ${sortString} LIMIT ? OFFSET ?`;

  const [rows] = await conn.query(sql, [limits, offset]) as any[];


  const [counts] = await conn.query(`SELECT count(*) as total ${fromAndJoin} ${where}`);

  return {
    results: rows ?? [],
    count: (counts as any[])?.[0]?.total ?? 0
  };
}


export type AnswerByIdInput = Pick<CustomerServiceEntity,"answer_description">

export const answerById = (conn:Connection) => async (id:number,obj: AnswerByIdInput) => {
  console.log(id,obj);
  await conn.query(
    SQL`UPDATE customer_services 
    set answer_description=${obj.answer_description},status='success',processed_at=CURRENT_TIMESTAMP
    where id=${conn.escape(id)}`
  );
}
