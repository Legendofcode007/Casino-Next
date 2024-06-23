import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react"; 
import requestIp from "request-ip";
import { getAbleGamingClient } from "../../../modules/api/getClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
      
    let isMobileView = (req
      ? req.headers['user-agent']
      : navigator.userAgent).match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    )
    const clinet = getAbleGamingClient();
                
    let is_mobile=false;

    if (isMobileView)
      is_mobile = true;

    const session = await getSession({ req });
    let user = session.user;

    !session ? res.redirect("/signin") : null;

    let query = req.query;
    let game_key = query.game_key;
    // let data = await findGametoPlay(game_key);

    let ip = requestIp.getClientIp(req);
    //console.log('ip',ip)
    
    console.log({
      account: String(user?.id),
      game_key: game_key,
      is_mobile,
      user_ip:ip
    })
    const result = await clinet.getGameUrl({
      account: String(user?.id),
      game_key: game_key,
      is_mobile,
      user_ip:ip
    })

    res.status(200).json(result);
    //return res.status(405).json({ message: "Method not allowed." });


  }
    
    
  else {
    return res.status(405).json({ message: "Method not allowed." });
  }
};

export default handler;