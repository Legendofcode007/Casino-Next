import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react"; 
import { getAbleGamingClient } from "../../../modules/api/getClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {

    const session = await getSession({ req });
    const client = getAbleGamingClient();
    let user = session.user;
    //console.log('api',user);

    !session ? res.redirect("/signin") : null;

    let query = req.query;
    //console.log('slug', query.slug);
    //console.log('offset', query.offset);

    let obj = {
      vendor_key: query.slug,
      page: query.offset,
      limit: query.limit 
    }

   
    let data = await client.getGames(obj);
    data = data.data.games;

    //let data = await findGameByProvider(obj);

    res.status(200).json(data);
      

  }
    
    
  else {
    return res.status(405).json({ message: "Method not allowed." });
  }
};

export default handler;