import type { NextApiRequest, NextApiResponse } from "next";
import { getResellersById} from "../../../database/users";
import { getSession } from "next-auth/react"; 
import { decrypt } from "../../../modules/crypto/encryption";
import { getPermissionByReseller } from "../../../database/user_permissions";
import { getResellerDataCount } from "../../../database/betting_history";
import { findRatebyReseller } from "../../../database/rate";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {

    const session = await getSession({ req });

    let user = session.user;
    //console.log('api',user);

    !session ? res.redirect("/signin") : null;

    let { filter, range, id } = req.query;
    //console.log('id',id)
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
    
    let data = await getResellersById(id);
    //let count = await getResellerCount();

    let getUsers = await getPermissionByReseller(id)
    //console.log(getUsers);

    let dataCount = [];
    
    if(getUsers.length)
      dataCount = await getResellerDataCount(getUsers, startDate, endDate);

    if (!dataCount.length) {
      dataCount = [{
        total_games: 0,
        total_amount: null,
        games_won: 0,
        games_lost: 0,
        amount_won: null,
        amount_lost: null
      }]
    }

    data[0].total_games = dataCount[0].total_games;
    data[0].total_amount = dataCount[0].total_amount;
    data[0].games_won = dataCount[0].games_won;
    data[0].games_lost = dataCount[0].games_lost;
    data[0].amount_won = dataCount[0].amount_won;
    data[0].amount_lost = dataCount[0].amount_lost;

    await calculate(data[0])
      

  
    
    res.setHeader("X-Total-Count", 1);
    res.status(200).json(data);

  } else {
    return res.status(405).json({ message: "Method not allowed." });
  }
};

const calculate = async (data:JSON) => {

  let resellerId = data.id;
  let rate = await findRatebyReseller(resellerId);
  let earnings = 0;
  let loss = 0;
  let amount_won = data.amount_won;
  let amount_lost = data.amount_lost;

  //console.log(rate)

  if (rate.length) {

    let casino_ggr = Number(rate[0].casino_ggr);
    let slot_ggr = Number(rate[0].slot_ggr);
    let casino_rolling = Number(rate[0].casino_rolling);
    let slot_rolling = Number(rate[0].slot_rolling);

    let resellerRate = (casino_ggr + slot_ggr + casino_rolling + slot_rolling)/(100);

    //console.log('resellerRate',resellerRate)

    if(amount_won)
      earnings = Number(amount_won * resellerRate);
        
    if(amount_lost)
      loss = Number(amount_lost*resellerRate);
        
  }//if (rate.length)

  data.earnings = earnings;
  data.loss = loss;

  return;

}

export default handler;