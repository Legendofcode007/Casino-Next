import type { NextApiRequest, NextApiResponse } from "next";
import { validateRole, validateMethods,GET,zodValdate, PUT} from "../../../../middlewares"
import { connectToDatabase,runTransaction } from "../../../../database/connection";
import { findOneByUserId,updateOnebyUserId,createBank } from "../../../../database/banks";
import { wrapMiddlewares } from "../../../../utils/warpMiddlewares"

const handler = wrapMiddlewares(
  validateMethods(["GET","PUT"]),
  validateRole(["admin","super_admin"])(
    wrapMiddlewares(
      GET(async (req: NextApiRequest, res: NextApiResponse,authenticatedUser) => {
        const conn = await connectToDatabase();
        const bank = await findOneByUserId(conn)(req.query.user_id);
        res.status(200).json(bank);
      }),
      PUT(async (req:NextApiRequest, res:NextApiResponse) => {
        const conn = await connectToDatabase();
        const bank = await findOneByUserId(conn)(req.query.user_id);

        const body = req.body;

        if(bank) {
          await updateOnebyUserId(conn)(req.query.user_id, {
            ...body
          })
        } else {
          await createBank(conn)({
            ...body,
            user_id: req.query.user_id
          })
        }
        res.status(200).json(bank);
      })
    )
  )
);


export default handler;