import type { NextApiRequest, NextApiResponse } from "next";
import { validateRole, validateMethods,GET,zodValdate, PUT} from "../../../../middlewares"
import {
  findOneById,
} from "../../../../database/admin/users";
import { 
  updateOneById, 
  UpdateUserInput } from "../../../../database/users"
import { connectToDatabase,runTransaction } from "../../../../database/connection";
import { getAbleGamingClient } from "../../../../modules/api/getClient"
import { updateOneRateByUserId} from "../../../../database/rate";
import { UpdateUserBodyZ, UpdateUserBody } from "../../../../dto/AdminUserDto";
import { wrapMiddlewares } from "../../../../utils/warpMiddlewares"
import { hash } from "bcryptjs";

const handler = wrapMiddlewares(
  validateMethods(["GET","PUT"]),
  validateRole(["admin","super_admin"])(
    wrapMiddlewares(
      PUT(wrapMiddlewares(
        zodValdate({
          body: UpdateUserBodyZ
        }),
        async (req: NextApiRequest, res: NextApiResponse,authenticatedUser:any) => {
          const client = getAbleGamingClient();
          const pool = await connectToDatabase();
          const body: UpdateUserBody = req.body;
          
          const user = await findOneById(pool)(Number(req.query.id));

          if(!user) return res.status(422).json({
            message: 'Not Found User'
          })
          const userId = await runTransaction(pool)(async (conn)=> {
            let inputData:UpdateUserInput = {
              approved: body.approved,
              balance: body.balance,
              is_active: body.approved,
              name: body.name,
              betting_limit: String(body.betting_limit),
              winning_limit: String(body.winning_limit),
              phone: body.phone,
              point: body.point,
              phone_verified: body.phone_verified
            }
            if(body.password) {
              inputData.password = await hash(body.password,12);
            }
            await updateOneById(conn)(user.id,inputData)
        
            if(user.role === 'reseller') {
              await updateOneRateByUserId(conn)(user.id,{
                casino_ggr: body.casino_ggr,
                casino_rolling: body.casino_rolling,
                slot_ggr: body.slot_ggr,
                slot_rolling: body.slot_rolling
              })
            }
      
            if(!user.approved && body.approved) {
              const res = await client.createUser(String(user.id),user.nick_name);
      
              if(res.error) {
                throw new Error('알본사 에러');
              }
      
              const balance = res.data.balance
              const gamer_id = res.data.id
      
              await updateOneById(conn)(user.id,{
                gamer_id,
                balance
              })
            }
      
            return user.id;
          });
      
      
          res.status(201).json({
            id: userId
          });
        })
      ),
      GET(async (req: NextApiRequest, res: NextApiResponse,authenticatedUser) => {
        const conn = await connectToDatabase();
        const user = await findOneById(conn)(req.query.id)
        res.status(200).json(user);
      }),
    )
  )
);


export default handler;