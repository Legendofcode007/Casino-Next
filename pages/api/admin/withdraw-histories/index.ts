import type { NextApiRequest, NextApiResponse } from "next";
import { getListParseQuery } from "../../../../utils/admin-react"
import { adminGetUsersAndCount } from "../../../../database/admin/users"
import { validateRole, validateMethods,POST,GET,zodValdate} from "../../../../middlewares"
import { connectToDatabase,runTransaction } from "../../../../database/connection";

import { wrapMiddlewares } from "../../../../utils/warpMiddlewares"
import { hash } from "bcryptjs";
import { adminGetWithdrawHistoriesAndCount } from "../../../../database/admin/withdraw_history";

const handler = wrapMiddlewares(
  validateMethods(["GET","POST"]),
  validateRole(["admin","super_admin"])(
    wrapMiddlewares(
      GET(async (req: NextApiRequest, res: NextApiResponse,user) => {
        const conn = await connectToDatabase();
        const { filter, limit,skip, sort,range} = getListParseQuery(req.query as any);
        const { count,results} = await adminGetWithdrawHistoriesAndCount(conn)({filter,limit,skip,sort: sort as [string,string]})
        // res.setHeader('Content-Range', `users ${range[0]}-${range[1]}/${count}`)
        res.setHeader('X-Total-Count', count);
        res.status(200).json(results);
      }),
    )
  )
);


export default handler;