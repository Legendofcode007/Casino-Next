import { hash } from "bcryptjs";
import requestIp from "request-ip";
let dateTime = require("node-datetime");
import * as BannedUserDB from "../../../database/banned_users";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  createUser,
  findOneByReferralCode,
  findOneByEmail,
  findOneByNickname
} from "../../../database/users";
import { connectToDatabase, runTransaction } from "../../../database/connection"
import { createPermission, insertPermission } from "../../../database/user_permissions";
import { wrapMiddlewares } from "../../../utils";
import { validateMethods, zodValdate } from "../../../middlewares";
import { UserSignupBodyDtoZ } from "../../../dto/UserDto";
import { createBank } from "../../../database/banks";



const handler = wrapMiddlewares(
  validateMethods(["POST"]),
  zodValdate({
    body:UserSignupBodyDtoZ
  }),
  async(req: NextApiRequest, res:NextApiResponse) => {
    const pool = await connectToDatabase();
    let ip = requestIp.getClientIp(req) as string;
    const verifyBan = await BannedUserDB.hasBannedIPOrUserId(pool)(ip);
    const {
      email,
      name,
      nick_name,
      password,
      referral_code,
      phone,
      acc_num,
      bank_name
    } = UserSignupBodyDtoZ.parse(req.body)
    if(verifyBan) return res.status(422).json({ message: "Access is forbidden for this user/ip" });
    if(await findOneByEmail(pool)(email)) return res.status(422).json({message: 'duplicate email'})
    if(await findOneByNickname(pool)(nick_name)) return res.status(422).json({message:'duplicate nickname'});
    
    const id = await runTransaction(pool)(async(conn)=> {
      const userId = await createUser(conn)({
        approved:false,
        balance:0,
        email,
        is_active:false,
        name,
        nick_name,
        phone,
        point:0,
        phone_verified: false,
        password: await hash(password,12),
        role:'user',
        ip      
      })

      await createBank(conn)({
        user_id: userId,
        acc_name: name,
        acc_num: acc_num,
        bank_name: bank_name
      })
     
      if(referral_code) {
        const reseller = await findOneByReferralCode(pool)(referral_code);
        if(reseller?.role != 'reseller') {
          throw Error('Not Found Referral Code')
        }
        createPermission(conn)({
          controller_id: reseller.id,
          user_id: userId
        })
      }
      return userId
    })

    return res.status(201).json({
      id 
    })
  }
)

export default handler;
