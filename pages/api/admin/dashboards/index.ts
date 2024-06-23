

import type { NextApiRequest, NextApiResponse } from "next";
import { validateRole, validateMethods,GET } from "../../../../middlewares"
import { connectToDatabase } from "../../../../database/connection";
import { getAbleGamingClient } from "../../../../modules/api/getClient"
import { wrapMiddlewares } from "../../../../utils/warpMiddlewares"
import * as CustomerServiceDB from "../../../../database/admin/customer_services"
import { GetDashboardResponse } from "../../../../dto/AdminDashboardDto";
import { getTodayStatistic } from "../../../../database/admin/beting_statistics";

const handler = wrapMiddlewares(
  validateMethods(["GET"]),
  validateRole(["admin","super_admin"])(
    wrapMiddlewares(
      GET(async (req: NextApiRequest, res: NextApiResponse,user) => {
        const pool = await  connectToDatabase();
        const unreadCount = await CustomerServiceDB.adminUnreadCount(pool)();
        const client = getAbleGamingClient();

        const info = await client.getAgentInfo()
          .then((v)=>({
            balance: v.data.balance,
            status: true
          }))
          .catch(()=>({
            status: false,
            balance: -1
          }))
        
        const results = await getTodayStatistic(pool)();
        return res.status(200).send({
          unreadCount,
          balance: info.balance,
          agentStatus: info.status,
          statistic: results[0]
        } as GetDashboardResponse)
      }),
    )
  )
);


export default handler;