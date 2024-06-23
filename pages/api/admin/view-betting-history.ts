import type { NextApiRequest, NextApiResponse } from "next";
import { adminGetBettingHistoriesAndCount } from "../../../database/admin/betting_history";
import { getSession } from "next-auth/react"; 
import { encrypt } from "../../../modules/crypto/encryption"
import { getListParseQuery, wrapMiddlewares } from "../../../utils";
import { GET, validateMethods, validateRole } from "../../../middlewares";
import { connectToDatabase } from "../../../database/connection";


const handler = wrapMiddlewares(
  validateMethods(["GET","POST"]),
  validateRole(["admin","super_admin"])(
    wrapMiddlewares(
      GET(async (req: NextApiRequest, res: NextApiResponse,user) => {
        const conn = await connectToDatabase();
        const { filter, limit,skip, sort,range} = getListParseQuery(req.query as any);
        const { count,results} = await adminGetBettingHistoriesAndCount(conn)({filter,limit,skip,sort: sort as [string,string]})
        // res.setHeader('Content-Range', `users ${range[0]}-${range[1]}/${count}`)
        res.setHeader('X-Total-Count', count);
        res.status(200).json(results);
      }),
    )
  )
);


export default handler;