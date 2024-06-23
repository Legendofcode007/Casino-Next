import type { NextApiRequest, NextApiResponse } from "next";
import { getListParseQuery } from "../../../utils/admin-react"
import { adminGetUsersAndCount } from "../../../database/admin/users"
import { validateRole, validateMethods,POST,GET,zodValdate} from "../../../middlewares"
import requestIp from "request-ip";
import {
  adminSendAllMail, adminSendMail, adminSendToNicknamesMail
} from "../../../database/admin/inbox";
import { connectToDatabase,runTransaction } from "../../../database/connection";
import { wrapMiddlewares } from "../../../utils/warpMiddlewares"
import { adminGetDepositHistoriesAndCount } from "../../../database/admin/deposit_history";
import { AdminSendMailBodyDto, AdminSendMailBodyDtoZ } from "../../../dto/AdminInboxDto";

const handler = wrapMiddlewares(
  validateMethods(["POST"]),
  validateRole(["admin","super_admin"])(
    wrapMiddlewares(
      zodValdate({
        body: AdminSendMailBodyDtoZ
      }),
      POST(async (req: NextApiRequest, res: NextApiResponse,user) => {
        const conn = await connectToDatabase();
        
        const body:AdminSendMailBodyDto = req.body;
        // res.setHeader('Content-Range', `users ${range[0]}-${range[1]}/${count}`)

        if(body.type ==='all') {
          await adminSendAllMail(conn)({
            message: body.subject,
            subject: body.message
          })
        } else if(body.type ==='bulk') {
          if(!Array.isArray(body.to)) return res.status(422).json({message: '올바르지 않는 형식'})
          await adminSendToNicknamesMail(conn)({
            message:body.message,
            subject:body.subject,
            to: body.to
          })
        } else {
          if(Array.isArray(body.to) || !body.to) return res.status(422).json({message: '올바르지 않는 형식'})
          await adminSendMail(conn)({
            message: body.message,
            subject: body.subject,
            thread_id: body.thread_id,
            nick_name: body.to
          })
        }
        res.status(201).json({message: '메세지 전송 성공'});
      }),
    )
  )
);


export default handler;