import type { NextApiRequest, NextApiResponse } from "next";
import { validateRole, validateMethods,POST,GET,zodValdate, PUT} from "../../../middlewares"
import requestIp from "request-ip";
import {
  findOneByEmail,
  findOneByNickname,
  createUser,
  findOneById,
  updateOneById
} from "../../../database/users";
import { connectToDatabase,runTransaction } from "../../../database/connection";
import { wrapMiddlewares } from "../../../utils/warpMiddlewares"
import { hash } from "bcryptjs";
import { defaultSuperAdminInfo } from "../../../utils/getNextAuthOptions";
import { UpdateUserBodyDtoZ, UserMeDtoZ } from "../../../dto/UserDto";

const handler = wrapMiddlewares(
  validateMethods(["GET","PUT"]),
  validateRole(["admin","reseller","user","super_admin"])(
    wrapMiddlewares(
      PUT(wrapMiddlewares(
        zodValdate({
          body: UpdateUserBodyDtoZ
        }),
        async (req: NextApiRequest, res: NextApiResponse,user:any) => {
          const pool = await connectToDatabase();
          const body = UpdateUserBodyDtoZ.parse(req.body);
          await updateOneById(pool)(user.id,body);

          return res.status(200).json({});
        })
      ),
      GET(async (req: NextApiRequest, res: NextApiResponse,autenticatedUser:any) => {
        const pool = await connectToDatabase();

        if(autenticatedUser.role === 'super_admin') {
          res.status(200).json(defaultSuperAdminInfo);
        } 
        const user = await findOneById(pool)(autenticatedUser.id)
        
        if(!user) {
          res.status(422).json({
            message: 'Not Found User'
          })
        }
        res.status(200).json(UserMeDtoZ.parse(user));
      }),
    )
  )
);


export default handler;