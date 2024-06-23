import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react"; 
import requestIp from "request-ip";
import { getAbleGamingClient } from "../../../modules/api/getClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const agent = (req?.headers['user-agent'] ?? navigator.userAgent).match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop|Windows phone/i)
    
    const clinet = getAbleGamingClient();
                
    const is_mobile=!!agent;

    const session = await getSession({ req });
    let user = session.user;

    !session ? res.redirect("/signin") : null;

    const query = req.query;
    const vendor_key = query.vendor_key as string;
    // let data = await findGametoPlay(game_key);

    const ip = requestIp.getClientIp(req);
    //console.log('ip',ip)

    console.log({
      account: String(user?.id),
      vendor_key,
      is_mobile,
      user_ip:ip as string
    })
    const result = await clinet.getLobbyUrl({
      account: String(user?.id),
      vendor_key,
      is_mobile,
      user_ip:ip as string
    })

    console.log(result);

    res.status(200).json(result);
  }
    
    
  else {
    return res.status(405).json({ message: "Method not allowed." });
  }
};

export default handler;