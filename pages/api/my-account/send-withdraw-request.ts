import type { NextApiRequest, NextApiResponse } from "next";
import { validateRole, validateMethods,POST,GET,zodValdate, PUT} from "../../../middlewares"
import requestIp from "request-ip";
import {
  findOneById,
  updateOneById
} from "../../../database/users";
import {
  findOneByUserId
} from "../../../database/banks";
import * as WithdrawHistoryDB from "../../../database/withdraw_history"
import { connectToDatabase } from "../../../database/connection";
import { wrapMiddlewares } from "../../../utils/warpMiddlewares"
import { WithdrawRequestBodyDtoZ } from "../../../dto/WithdrawDto";

const handler = wrapMiddlewares(
  validateMethods(["POST"]),
  validateRole(["admin","reseller","user"])(
    wrapMiddlewares(
      POST(wrapMiddlewares(
        zodValdate({
          body: WithdrawRequestBodyDtoZ
        }),
        async (req: NextApiRequest, res: NextApiResponse,autenticatedUser:any) => {
          const pool = await connectToDatabase();
          const { 
            amount,
          } = WithdrawRequestBodyDtoZ.parse(req.body);
          const user = await findOneById(pool)(autenticatedUser.id);
          const bank = await findOneByUserId(pool)(autenticatedUser.id);

          await WithdrawHistoryDB.createWithdrawHistory(pool)({
            acc_name: bank?.acc_name ?? '',
            acc_num: bank?.acc_num ?? '',
            bank_name: bank?.bank_name ?? '',
            withdraw_amount: amount,
            balance_before: user.balance,
            nick_name: user.nick_name,
            role: user.role as any,
            user_id: user.id
          })

          return res.status(201).json({ message: "Request sent" });
        })
      ),
    )
  )
);

export default handler;