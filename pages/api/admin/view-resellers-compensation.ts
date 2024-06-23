import type { NextApiRequest, NextApiResponse } from "next";
import { getResellers, getResellerCount } from "../../../database/users";
import { getSession } from "next-auth/react"; 
import { encrypt } from "../../../modules/crypto/encryption";
import { getPermissionByReseller } from "../../../database/user_permissions";
import { getResellerDataCount } from "../../../database/betting_history";
import { findRatebyReseller } from "../../../database/rate";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {

    const session = await getSession({ req });

    let user = session.user;
    

    !session ? res.redirect("/signin") : null;

    let role = user.role;
    console.log('role', role);
    
    let userId = user.id;
    console.log('userId', userId);

    let sort = req.query.sort.slice(1, -1).split(",")[1].trim();
    sort = sort.replace(/[^a-zA-Z ]/g, "");

    let skip = req.query.range.slice(1, -1).split(",")[0].trim();
    skip = Number(skip);

    let limit = req.query.range.slice(1, -1).split(",")[1].trim();
    limit = Number(limit - skip)+(1);

    let sortBy = req.query.sort.slice(1, -1).split(",")[0].trim();
    sortBy = sortBy.replace(/[^a-zA-Z_ ]/g, "");

    let filter = JSON.parse(req.query.filter);
    let start=null;
    let end=null;
    
    if (filter.start) {
      start = filter.start;
      end = filter.end;
    }

    //console.log('start', start)
    //console.log('end',end)
    
    let data = await getResellers(skip, limit, role, userId);
    let count;
      
    if(role=='admin' || role=='super_admin')
      count = await getResellerCount();

    for (var i = 0; i < data.length; i++) {
      data[i].encryptId = await encrypt(data[i].id);

      let resellerId = data[i].id;

      let getUsers = await getPermissionByReseller(resellerId)
      //console.log(getUsers);

      let dataCount = [];
      // for (var j = 0; j < getUsers.length; j++) {
      if(getUsers.length)
        dataCount = await getResellerDataCount(getUsers, start, end);
        //console.log('dataCount', dataCount);
      //}//for

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

      data[i].total_games = dataCount[0].total_games;
      data[i].total_amount = dataCount[0].total_amount;
      data[i].games_won = dataCount[0].games_won;
      data[i].games_lost = dataCount[0].games_lost;
      data[i].amount_won = dataCount[0].amount_won;
      data[i].amount_lost = dataCount[0].amount_lost;

      await calculate(data[i])
      

    }
    

    if(role=='admin' || role=='super_admin')
      res.setHeader("X-Total-Count", count[0].total);
    else
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