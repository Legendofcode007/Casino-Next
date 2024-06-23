import type { NextApiRequest, NextApiResponse } from "next";
import { validateRole, validateMethods,POST,GET,zodValdate, PATCH, PUT} from "../../../../../middlewares"
import { connectToDatabase,runTransaction } from "../../../../../database/connection";
import { wrapMiddlewares } from "../../../../../utils/warpMiddlewares"
import {  findOneById  } from "../../../../../database/customer_services";
import { answerById } from "../../../../../database/admin/customer_services";

const handler = wrapMiddlewares(
  validateMethods(["POST"]),
  validateRole(["admin","super_admin"])(
    wrapMiddlewares(
      POST(async (req: NextApiRequest, res: NextApiResponse,user) => {
        const pool = await connectToDatabase();
        const query = req.query;
        const { answer_description } = req.body;

        await answerById(pool)(Number(query.id),{answer_description});

        res.status(200).send({
          message:'success'
        })
      }),
    )
  )
);


export default handler;