import type { NextApiRequest, NextApiResponse } from "next";
import { getListParseQuery } from "../../../../utils/admin-react"
import { validateRole, validateMethods,POST,GET,zodValdate} from "../../../../middlewares"
import { connectToDatabase } from "../../../../database/connection";
import { getAbleGamingClient } from "../../../../modules/api/getClient"
import { wrapMiddlewares } from "../../../../utils/warpMiddlewares"
import { adminGetNoticeBoardsAndCount } from "../../../../database/admin/notice_boards";
import { createNotice, insertNotice } from "../../../../database/notice_board";
import { CreateNoticeBodyZ } from "../../../../dto/AdminNoticeBoardDto";

const handler = wrapMiddlewares(
  validateMethods(["GET","POST"]),
  validateRole(["admin","super_admin"])(
    wrapMiddlewares(
      POST(wrapMiddlewares(
        zodValdate({
          body: CreateNoticeBodyZ
        }),
        async (req: NextApiRequest, res: NextApiResponse) => {
          const client = getAbleGamingClient();
          const pool = await connectToDatabase()
          let { subject, message } = req.body;   
          
          const id = await createNotice(pool)({subject,message});
      
          res.status(201).json({ id });
        })
      ),
      GET(async (req: NextApiRequest, res: NextApiResponse,user) => {
        console.log('call');
        const conn = await connectToDatabase();
        console.log(req.query);
        const { filter, limit,skip, sort,range} = getListParseQuery(req.query as any);
        const { count,results} = await adminGetNoticeBoardsAndCount(conn)({filter,limit,skip,sort: sort as [string,string]})
        console.log(results);
        // res.setHeader('Content-Range', `users ${range[0]}-${range[1]}/${count}`)
        res.setHeader('X-Total-Count', count);
        res.status(200).json(results);
      }),
    )
  )
);


export default handler;