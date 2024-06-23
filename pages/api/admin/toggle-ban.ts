import type { NextApiRequest, NextApiResponse } from "next";
import { validateRole, validateMethods,POST,GET,zodValdate, PATCH} from "../../../middlewares"
import * as UserDB from "../../../database/users";
import { connectToDatabase,runTransaction } from "../../../database/connection";
import { getAbleGamingClient } from "../../../modules/api/getClient"
import { wrapMiddlewares } from "../../../utils/warpMiddlewares"
import { ToggleBannBody, ToggleBannBodyZ } from "../../../dto/AdminBannDto";
import * as BannedUserDB from '../../../database/banned_users'
import { AuthenticatedUser } from "../../../dto/AuthenticatedUserDto";

const handler = wrapMiddlewares(
  validateMethods(["POST"]),
  zodValdate({
    body: ToggleBannBodyZ
  }),
  validateRole(["admin","super_admin"])(
    async (req: NextApiRequest, res: NextApiResponse,authenticatedUser:AuthenticatedUser) => {
      const pool = await connectToDatabase();
      const body: ToggleBannBody = req.body;
      const user = await UserDB.findOneById(pool)(body.user_id);
      if(!user) return res.status(400).json({message:'해당 유저를 찾을 수 없습니다.'});

      await BannedUserDB.toggleBannByUserid(pool)({
        banned_by_id: authenticatedUser.id,
        user_id: user.id,
        ip: String(user.ip ?? '') 
      })

      res.status(201).json({
        id: user.id
      });
    })
);


export default handler;