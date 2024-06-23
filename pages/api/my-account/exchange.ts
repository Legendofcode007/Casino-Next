import type { NextApiRequest, NextApiResponse } from "next";
import { validateRole, validateMethods,POST,GET,zodValdate, PUT} from "../../../middlewares"
import {
  UpdatePointToBalanceByUserId, findOneById,
} from "../../../database/users";
import { connectToDatabase, runTransaction } from "../../../database/connection";
import { wrapMiddlewares } from "../../../utils/warpMiddlewares"
import { getAbleGamingClient } from "../../../modules/api/getClient";

const handler = wrapMiddlewares(
  validateMethods(["POST"]),
  validateRole(["admin","reseller","user"])(
    wrapMiddlewares(
      POST(wrapMiddlewares(
        async (req: NextApiRequest, res: NextApiResponse,authenticatedUser:any) => {
          const pool = await connectToDatabase();
          const client = getAbleGamingClient();
          await runTransaction(pool)(async (conn)=>{
            const user = await findOneById(conn)(authenticatedUser.id);
            await UpdatePointToBalanceByUserId(conn)(user.id);

            const result = await client.deposit(String(user.id), user.point)

            if(result.error) throw new Error("작업중 오류가 발생했습니다 나중에 다시 시도해주세요");
          })

          return res.status(200).json({
            message: 'success'
          });
        })
      ),
    )
  )
);


export default handler;