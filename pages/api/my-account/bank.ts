import type { NextApiRequest, NextApiResponse } from "next";
import { validateRole, validateMethods,POST,GET,zodValdate, PUT} from "../../../middlewares"
import requestIp from "request-ip";
import {
  findOneById,
  updateOneById
} from "../../../database/users";
import * as BankDB from "../../../database/banks"
import { connectToDatabase } from "../../../database/connection";
import { wrapMiddlewares } from "../../../utils/warpMiddlewares"
import { defaultSuperAdminInfo } from "../../../utils/getNextAuthOptions";
import { UpdateBankBodyDtoZ } from "../../../dto/BankDto";

const handler = wrapMiddlewares(
  validateMethods(["GET","PUT"]),
  validateRole(["admin","reseller","user"])(
    wrapMiddlewares(
      PUT(wrapMiddlewares(
        zodValdate({
          body: UpdateBankBodyDtoZ
        }),
        async (req: NextApiRequest, res: NextApiResponse,user:any) => {
          const pool = await connectToDatabase();
          const body = UpdateBankBodyDtoZ.parse(req.body);
          await BankDB.updateOnebyUserId(pool)(user.id,body);

          return res.status(200).json({
            message: 'success'
          });
        })
      ),
      GET(async (req: NextApiRequest, res: NextApiResponse,autenticatedUser:any) => {
        const pool = await connectToDatabase();

        if(autenticatedUser.role === 'super_admin') {
          res.status(201).json(defaultSuperAdminInfo);
        } 
        const bankInfo = await BankDB.findOneByUserId(pool)(autenticatedUser.id)
        
        res.status(201).json(bankInfo ?? {});
      }),
    )
  )
);


export default handler;