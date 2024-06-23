import type { NextApiRequest, NextApiResponse } from "next";
import { getAllNoticeCount, getCount } from "../../../database/notice_board"
import { connectToDatabase } from "../../../database/connection"
import { wrapMiddlewares } from "../../../utils";
import { validateMethods, validateRole } from "../../../middlewares";

const handler = wrapMiddlewares(
  validateMethods(["GET"]),
  async(req: NextApiRequest, res:NextApiResponse) => {
    const pool = await connectToDatabase();
    
    const noticeCount = await getAllNoticeCount(pool)();
    res.setHeader("Cache-Control","max-age=60")
    return res.status(200).json({
      count:noticeCount
    })
  }
)

export default handler;
