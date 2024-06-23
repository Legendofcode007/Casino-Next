import { Pool } from "mysql2/promise"
import { NoticeBoard } from "../../entities/notice_board";

export type AdminGetNoticeBoardsAndCountQuery = {
  filter: {
  };
  limit: number;
  skip: number;
  sort?: [string,string]
}

export const adminGetNoticeBoardsAndCount = (conn: Pool) => async ({filter = {},limit,skip,sort}: AdminGetNoticeBoardsAndCountQuery): Promise<{results:NoticeBoard,count:number}> => {
  let limits = limit;
  let offset = skip;

  const sortString = sort?.length  ? `order by ${conn.escapeId(sort[0])} ${sort[1]}`:''
  let fromAndJoin = 'FROM notice_board ';

  const sql = `SELECT* 
    ${fromAndJoin}
    ${sortString} LIMIT ? OFFSET ?`;

  const [rows] = await conn.query(sql, [limits, offset]) as any[];
  const [counts] = await conn.query(`SELECT count(*) as total ${fromAndJoin}`);

  return {
    results: rows ?? [],
    count: (counts as any[])?.[0]?.total ?? 0
  };
}