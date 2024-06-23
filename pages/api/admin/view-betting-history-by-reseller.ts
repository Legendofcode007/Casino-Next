import type { NextApiRequest, NextApiResponse } from "next";
import { getBettingHistoryByReseller, getCountByReseller } from "../../../database/betting_history";
import { getSession } from "next-auth/react"; 
import { encrypt } from "../../../modules/crypto/encryption"
import { decrypt } from "../../../modules/crypto/encryption"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === "GET") {

    const session = await getSession({ req });

    //let user = session.user;
    //console.log('api',user);

    !session ? res.redirect("/signin") : null;

    let { filter, range, id } = req.query;
    id = await decrypt(id)
    filter = JSON.parse(filter);

    let start;
    let end;

    let startDate = null;
    let endDate = null;
    
    if (filter.start!='null') {

      start = filter.start;
      end = filter.end;
  
      startDate = new Date(start);
      startDate = startDate.toISOString().split('T')[0];
      //console.log('startDate', startDate);

      endDate = new Date(end);
      endDate = endDate.toISOString().split('T')[0];
      //console.log('endDate', endDate);
      
    }

    let skip = range.slice(1, -1).split(",")[0].trim();
    skip = Number(skip);
    let limit = range.slice(1, -1).split(",")[1].trim();
    limit = Number(limit - skip)+(1);

    let data = await getBettingHistoryByReseller(skip, limit, startDate, endDate,id);

    let count = await getCountByReseller(startDate, endDate, id);

    for (var i = 0; i < data.length; i++) {
      data[i].encryptId = await encrypt(data[i].user_id);
      data[i].encryptResellerId = await encrypt(data[i].reseller_id);
    }

    res.setHeader("X-Total-Count", count[0].total);
    res.status(200).json(data);


    /*
    let 
    
    //console.log('keys',keys, keys.length)

    //if (keys.length)
      //if(keys[0] != 'start')
    
    
    
    //if (keys.length)
      //if(keys[0] != 'start')
    
    //console.log('filter',filter.start)
    
    //console.log('values',values)

    
    */
    
  

  } else {
    return res.status(405).json({ message: "Method not allowed." });
  }
};

export default handler;