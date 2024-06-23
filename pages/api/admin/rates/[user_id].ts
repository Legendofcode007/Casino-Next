import type { NextApiRequest, NextApiResponse } from "next";
import { validateRole, validateMethods,GET,zodValdate, PUT} from "../../../../middlewares"

import { connectToDatabase,runTransaction } from "../../../../database/connection";
import { findOneByUserId } from "../../../../database/rate";
import { wrapMiddlewares } from "../../../../utils/warpMiddlewares"

const handler = wrapMiddlewares(
  validateMethods(["GET"]),
  validateRole(["admin","super_admin"])(
    wrapMiddlewares(
      GET(async (req: NextApiRequest, res: NextApiResponse,authenticatedUser) => {
        const conn = await connectToDatabase();
        const rate = await findOneByUserId(conn)(req.query.user_id)
        res.status(200).json(rate);
      }),
    )
  )
);


export default handler;