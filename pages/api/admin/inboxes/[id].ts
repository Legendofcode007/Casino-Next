import type { NextApiRequest, NextApiResponse } from "next";
import { validateRole, validateMethods,POST,GET,zodValdate, PATCH, PUT} from "../../../../middlewares"
import { connectToDatabase,runTransaction } from "../../../../database/connection";
import { wrapMiddlewares } from "../../../../utils/warpMiddlewares"
import {  findOneById  } from "../../../../database/customer_services";

const handler = wrapMiddlewares(
  validateMethods(["PUT","GET"]),
  validateRole(["admin","super_admin"])(
    wrapMiddlewares(
      GET(async (req: NextApiRequest, res: NextApiResponse,user) => {
        const pool = await connectToDatabase();
        const query = req.query;

        const inbox =  await findOneById(pool)(Number(query.id));

        res.status(200).send(inbox)
        // res.setHeader('Content-Range', `users ${range[0]}-${range[1]}/${count}`)
      }),
    )
  )
);


export default handler;