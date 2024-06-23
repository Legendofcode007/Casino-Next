import type { NextApiRequest, NextApiResponse } from "next";
import { readInboxByUserId, unreadCountByUserId } from "../../../../database/inbox"
import { connectToDatabase } from "../../../../database/connection"
import { wrapMiddlewares } from "../../../../utils";
import { validateMethods, validateRole } from "../../../../middlewares";

const handler = wrapMiddlewares(
  validateMethods(["POST"]),
  validateRole(["user","admin","reseller","super_admin"])(
    async(req: NextApiRequest, res:NextApiResponse,user) => {
      const pool = await connectToDatabase();
      if(Number.isNaN(Number(req.query.id))) return res.status(400).json({
        message: '잘못된 요청'
      })
      
      await readInboxByUserId(pool)({
        id: req.query.id,
        user_id: user.id
      });

      return res.status(200).json({
        message:'success'
      })
  })
)

export default handler;
