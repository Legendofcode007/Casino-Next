import type { NextApiRequest, NextApiResponse } from "next";
import { createCustomerService } from "../../../database/customer_services"
import { connectToDatabase } from "../../../database/connection"
import { wrapMiddlewares } from "../../../utils";
import { POST, validateMethods, validateRole, zodValdate } from "../../../middlewares";
import { CreateCustomerServiceBodyDtoZ,CreateCustomerServiceBodyDto } from "../../../dto/CustomerServiceDto"
const handler = wrapMiddlewares(
  validateMethods(["POST"]),
  zodValdate({
    body: CreateCustomerServiceBodyDtoZ
  }),
  validateRole(["user","admin","reseller","super_admin"])(
    POST(async(req: NextApiRequest, res:NextApiResponse,user) => {
        const body: CreateCustomerServiceBodyDto = req.body;
        const pool = await connectToDatabase();
        
         await createCustomerService(pool)({
          ...body,
          user_id: user.id
        });

        return res.status(201).json({
          message: 'success'
        })
    })
  )
)

export default handler;
