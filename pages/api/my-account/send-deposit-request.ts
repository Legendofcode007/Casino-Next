import type { NextApiRequest, NextApiResponse } from "next";
import { validateRole, validateMethods,POST,GET,zodValdate, PUT} from "../../../middlewares"
import requestIp from "request-ip";
import {
  findOneByUserId
} from "../../../database/banks";
import * as DepositHistoryDB from "../../../database/deposit_history"
import { connectToDatabase } from "../../../database/connection";
import { wrapMiddlewares } from "../../../utils/warpMiddlewares"
import { DepositRequestBodyDtoZ } from "../../../dto/DepositDto";

const handler = wrapMiddlewares(
  validateMethods(["POST"]),
  validateRole(["admin","reseller","user"])(
    wrapMiddlewares(
      POST(wrapMiddlewares(
        zodValdate({
          body: DepositRequestBodyDtoZ
        }),
        async (req: NextApiRequest, res: NextApiResponse,autenticatedUser:any) => {
          const pool = await connectToDatabase();
          const { 
            amount,
          } = DepositRequestBodyDtoZ.parse(req.body);
          const bank = await findOneByUserId(pool)(autenticatedUser.id);

          await DepositHistoryDB.createDepositHistory(pool)({
            acc_name: bank?.acc_name ?? '',
            acc_num: bank?.acc_num ?? '',
            bank_name: bank?.bank_name ?? '',
            deposit_amount: amount,
            user_id: autenticatedUser.id
          })

          return res.status(201).json({ message: "Request sent" });
        })
      ),
    )
  )
);


export default handler;