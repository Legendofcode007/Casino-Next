import type { NextApiRequest, NextApiResponse } from "next";
import { findRatebyReseller } from "../../../database/rate";
import { decrypt } from "../../../modules/crypto/encryption"
import { getSession } from "next-auth/react"; 

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {

    const session = await getSession({ req });
    let user = session.user;
    //console.log('api',user);

    !session ? res.redirect("/signin") : null;

    let { id } = req.query;   
    id = await decrypt(id)
  
    let data = await findRatebyReseller(id);

    res.setHeader('X-Total-Count', 1);
    res.status(200).json(data);
    
  } else {
    return res.status(405).json({ message: "Method not allowed." });
  }
};

export default handler;
