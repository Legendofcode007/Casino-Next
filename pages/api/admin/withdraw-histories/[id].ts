import type { NextApiRequest, NextApiResponse } from "next";
import { getListParseQuery } from "../../../../utils/admin-react"
import { adminGetUsersAndCount } from "../../../../database/admin/users"
import { validateRole, validateMethods,POST,GET,zodValdate, PATCH, PUT} from "../../../../middlewares"
import { connectToDatabase,runTransaction } from "../../../../database/connection";
import { getAbleGamingClient } from "../../../../modules/api/getClient"
import { wrapMiddlewares } from "../../../../utils/warpMiddlewares"
import {  findOneById  } from "../../../../database/withdraw_history";
import * as UserDB from '../../../../database/users'
import { UpdateDepositHistoryBodyZ,UdpateDepositHistoryBody } from "../../../../dto/AdminDepositHistoryDto";
import { updateStatusById } from "../../../../database/admin/withdraw_history";

const handler = wrapMiddlewares(
  validateMethods(["PUT"]),
  zodValdate({
    body: UpdateDepositHistoryBodyZ 
  }),
  validateRole(["admin","super_admin"])(
    wrapMiddlewares(
      PUT(async (req: NextApiRequest, res: NextApiResponse,user) => {
        const pool = await connectToDatabase();
        const body = req.body as UdpateDepositHistoryBody;
        const query = req.query;
        const client = getAbleGamingClient();

        const result = await runTransaction(pool)(async (conn)=>{
          const withdraw =  await findOneById(conn)(Number(query.id));
          if(!withdraw) throw new Error('출금 요청 정보를 찾을 수 없음 ');
          
          if(withdraw.status === 'pending' && body.status === 'success') {
            await UserDB.updateBalanceByUserId(conn)(withdraw.user_id,{
              balance: {
                amount: String(withdraw.withdraw_amount),
                command:'-'
              }
            })
            
            const res = await client.withdraw(String(withdraw.user_id),Number(withdraw.withdraw_amount))

            if(!res.data.result) new Error('알본사 에러');
          }

          await updateStatusById(conn)(withdraw.id,body.status);
          return withdraw;
        })


        res.status(200).send({
          id: result.id
        })
        // res.setHeader('Content-Range', `users ${range[0]}-${range[1]}/${count}`)
      }),
    )
  )
);


export default handler;