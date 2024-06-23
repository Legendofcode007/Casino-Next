import type { NextApiRequest, NextApiResponse } from "next";
import { unreadCountByUserId } from "../../../database/inbox"
import { connectToDatabase } from "../../../database/connection"
import { wrapMiddlewares } from "../../../utils";
import { validateMethods, validateRole } from "../../../middlewares";

const handler = wrapMiddlewares(
  validateMethods(["GET"]),
  validateRole(["user","admin","reseller","super_admin"])(
    async(req: NextApiRequest, res:NextApiResponse,user) => {
      const pool = await connectToDatabase();
      
      const inboxCount = await unreadCountByUserId(pool)(user.id);

      res.setHeader("Cache-Control","max-age=60")
      return res.status(200).json({
        count:inboxCount
      })
  })
)

export default handler;
