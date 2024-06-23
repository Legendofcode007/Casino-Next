import type { NextApiRequest, NextApiResponse } from "next";
import { validateRole, validateMethods,POST,GET,zodValdate, PATCH, PUT} from "../../../../middlewares"
import { connectToDatabase,runTransaction } from "../../../../database/connection";
import { getAbleGamingClient } from "../../../../modules/api/getClient"
import { wrapMiddlewares } from "../../../../utils/warpMiddlewares"
import {  findOneById  } from "../../../../database/deposit_history";
import * as UserDB from '../../../../database/users'
import { UpdateDepositHistoryBodyZ,UdpateDepositHistoryBody } from "../../../../dto/AdminDepositHistoryDto";
import { updateDepositHistoryByID } from "../../../../database/admin/deposit_history";

const handler = wrapMiddlewares(
  validateMethods(["PUT","GET"]),
  validateRole(["admin","super_admin"])(
    wrapMiddlewares(
      PUT(wrapMiddlewares(
        zodValdate({
          body: UpdateDepositHistoryBodyZ 
        }),
        async (req: NextApiRequest, res: NextApiResponse) => {
        const pool = await connectToDatabase();
        const body = req.body as UdpateDepositHistoryBody;
        const query = req.query;
        const client = getAbleGamingClient();

        const result = await runTransaction(pool)(async (conn)=>{
          const deposit =  await findOneById(conn)(Number(query.id));
          if(deposit.status === 'pending' && body.status === 'success') {
            await UserDB.updateBalanceByUserId(conn)(deposit.user_id,{
              balance: {
                amount: String(deposit.deposit_amount),
                command:'+'
              },
              point: {
                amount: String(body.deposit_point),
                command: '+'
              }
              
            })
            
            const res = await client.deposit(String(deposit.user_id),Number(deposit.deposit_amount))
            if(!res.data.result) new Error('알본사 에러');
            
          }
          await updateDepositHistoryByID(conn)(deposit.id,{
            status: body.status,
            deposit_point: body.deposit_point
          });

          return deposit;
        })


        res.status(200).send({
          id: result.id
        })
        // res.setHeader('Content-Range', `users ${range[0]}-${range[1]}/${count}`)
      })),
      GET(async (req: NextApiRequest, res: NextApiResponse,user) => {
        const pool = await connectToDatabase();
        const history = await findOneById(pool)(req.query.id);

        return res.status(200).send(history);
      })
    )
  )
);


export default handler;