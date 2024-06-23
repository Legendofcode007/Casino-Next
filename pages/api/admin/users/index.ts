import type { NextApiRequest, NextApiResponse } from "next";
import { getListParseQuery } from "../../../../utils/admin-react"
import { adminGetUsersAndCount } from "../../../../database/admin/users"
import { validateRole, validateMethods,POST,GET,zodValdate} from "../../../../middlewares"
import requestIp from "request-ip";
import {
  findOneByEmail,
  findOneByNickname,
  createUser,
  findOneById,
  updateOneById
} from "../../../../database/users";
import { connectToDatabase,runTransaction } from "../../../../database/connection";
import { getAbleGamingClient } from "../../../../modules/api/getClient"
import { createRate } from "../../../../database/rate";
import { createPermission  } from '../../../../database/user_permissions'
import { CreateUserBodyDto,CreaeteUserBodyDtoZ } from "../../../../dto/AdminUserDto";
import { wrapMiddlewares } from "../../../../utils/warpMiddlewares"
import { hash } from "bcryptjs";

const handler = wrapMiddlewares(
  validateMethods(["GET","POST"]),
  validateRole(["admin","super_admin"])(
    wrapMiddlewares(
      POST(wrapMiddlewares(
        zodValdate({
          body: CreaeteUserBodyDtoZ
        }),
        async (req: NextApiRequest, res: NextApiResponse) => {
          const client = getAbleGamingClient();
          const pool = await connectToDatabase();
          const body: CreateUserBodyDto = req.body;
          const userExists = await findOneByEmail(pool)(body.email);
      
          //console.log("userExists", userExists);
      
          if (userExists) {
            return res
              .status(422)
              .json({ message: "email " + body.email + " already exists" });
          }
      
          const nickNameExists = await findOneByNickname(pool)(body.nick_name);
      
          if (nickNameExists) {
            return res
              .status(422)
              .json({ message: "nick name " + body.nick_name + " already exists" });
          }
          if(body.role === 'user' && body.reseller_id) {
            const reseller = await findOneById(pool)(body.reseller_id);
            if(!reseller) return res
              .status(422)
              .json({ message: "해당 총판를 찾을 수 없습니다." });
          }
          
          const userId = await runTransaction(pool)(async (conn)=> {
            const createdUserId = await createUser(conn)({
              approved: body.approved ?? false,
              balance: body.balance,
              email:body.email,
              password: await hash(body.password,12),
              is_active: body.approved ?? false,
              name: body.name,
              nick_name:body.nick_name,
              role: body.role,
              betting_limit: String(body.betting_limit),
              winning_limit: String(body.winning_limit),
              phone: body.phone,
              phone_verified: body.phone_verified ?? false,
              point: body.point,
            })
        
            if(body.role === 'reseller') {
              await createRate(conn)({
                casino_ggr: body.casino_ggr,
                casino_rolling: body.casino_rolling,
                slot_ggr: body.slot_ggr,
                slot_rolling: body.slot_rolling,
                reseller_id: createdUserId
              })
            }
            if(body.role === 'user' && body.reseller_id) {
              await createPermission(conn)({
                controller_id: body.reseller_id,
                user_id: createdUserId
              })
            }
      
            if(body.approved) {
              const res = await client.createUser(String(createdUserId),body.nick_name);
      
              if(res.error) {
                throw new Error('알본사 에러');
              }
      
              const balance = res.data.balance
              const gamer_id = res.data.id
      
              await updateOneById(conn)(createdUserId,{
                gamer_id,
                balance
              })
            }
      
            return createdUserId;
          });
      
      
          res.status(201).json({
            id: userId
          });
        })
      ),
      GET(async (req: NextApiRequest, res: NextApiResponse,user) => {
        const conn = await connectToDatabase();
        const { filter, limit,skip, sort,range} = getListParseQuery(req.query as any);
        const { count,results} = await adminGetUsersAndCount(conn)({filter,limit,skip,sort: sort as [string,string]})
        // res.setHeader('Content-Range', `users ${range[0]}-${range[1]}/${count}`)
        res.setHeader('X-Total-Count', count);
        res.status(200).json(results);
      }),
    )
  )
);


export default handler;