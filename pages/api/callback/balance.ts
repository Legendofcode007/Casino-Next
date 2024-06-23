import type { NextApiRequest, NextApiResponse } from "next";
import { findOneById, findUserById } from "../../../database/users";
import { wrapMiddlewares } from "../../../utils";
import { validateMethods } from "../../../middlewares";
import { getAbleGamingClient } from "../../../modules/api/getClient"
import { connectToDatabase } from "../../../database/connection";
import { createFailedCallback } from "../../../modules/api/client";
import BigNumber from "bignumber.js";

const handler = wrapMiddlewares(
  validateMethods(["POST"]),
  async (req: NextApiRequest,res:NextApiResponse) => {
    const clinet = getAbleGamingClient();
    const pool = await connectToDatabase();
    await clinet.callbackBalance(req,res)(async (account)=> {
      const userId = Number(account);

      console.log('callback blaance');


      console.log(req.body,req.query,account)
      const user = await findOneById(pool)(userId);

      if(!user) return createFailedCallback('Not Found User');
      return  {
        data: {
          status: true,
          balance: new BigNumber(user.balance).toFixed(2)
        }
      }
    })
  }
)

export default handler;