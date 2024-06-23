import type { NextApiRequest, NextApiResponse } from "next";
import { getListParseQuery } from "../../../../utils/admin-react"
import { searchNameOrNickname } from "../../../../database/admin/users"
import { validateRole, validateMethods,POST,GET,zodValdate, PATCH} from "../../../../middlewares"

import { connectToDatabase,runTransaction } from "../../../../database/connection";
import { SearchQueryZ, SearchQuery } from "../../../../dto/RegisterUserBodyDto";
import { wrapMiddlewares } from "../../../../utils/warpMiddlewares"

const handler = wrapMiddlewares(
  validateMethods(["GET"]),
  validateRole(["admin","super_admin"])(
    GET(wrapMiddlewares(
      zodValdate({
        query: SearchQueryZ
      }),
      async (req: NextApiRequest, res: NextApiResponse) => {
        console.log('seacrh Call',req.query);
        const conn = await connectToDatabase();
        const query = req.query as SearchQuery;
        const results = await searchNameOrNickname(conn)({
          searh: query.q,
          role: query.role
        })
        console.log(results)
        res.status(200).json(results);
      })
    ),
  )
);


export default handler;