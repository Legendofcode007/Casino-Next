import type { NextApiRequest, NextApiResponse } from "next";
import { findOneById } from "../../../database/users";
import { wrapMiddlewares } from "../../../utils";
import { validateMethods } from "../../../middlewares";
import { getAbleGamingClient } from "../../../modules/api/getClient";
import { connectToDatabase, runTransaction } from "../../../database/connection";
import * as BettingHistoryDB from '../../../database/betting_history'
import * as UserDB from "../../../database/users"
import * as BettingStaticsDB from "../../../database/betting_statistics";
import { 
  BigNumber
} from 'bignumber.js'
import { createFailedCallback, createSuccessCallback } from "../../../modules/api/client";

const handler = wrapMiddlewares(
  validateMethods(["POST"]),
  async (req: NextApiRequest,res:NextApiResponse) => {
    const clinet = getAbleGamingClient();
    const pool = await connectToDatabase();

    console.log('callback debit')
    await clinet.callbackDebit(req,res)(async (data)=> {
      console.log(req.body)
      const userId = Number(data.user_account);
      const game_type = data.game_type === 'casino' ? 'live':'slot';
      return  runTransaction(pool)(async (conn)=>{
        const user = await findOneById(conn)(userId);
        console.log('step1',user)
        if(!user) return createFailedCallback('Not Found User');
        if(data.command === 'bet' && new BigNumber(user.betting_limit ?? 0).isLessThanOrEqualTo(data.amount)) 
          return createFailedCallback('Betting Limit Over');
        
        const betting = await BettingHistoryDB.findOne(conn)({
          result: data.command === 'bet' ? 'bet':'cancelled',
          transaction_id: data.command === 'bet' ? data.transaction_id:data.match_transaction_id,
          user_id: user.id
        }).catch(err=>{
          console.log(err)
          throw err;
        })
        console.log('step2',betting)

        if(betting) return createFailedCallback('Already bet');

        const insertData: BettingHistoryDB.CreateBettingHistoryInput = {
          i_action_id:data.i_action_id,
          game_key:data.game_key,
          game_type:game_type,
          vendor_key:data.vendor_key,
          result: data.command === 'bet' ? 'bet':'cancelled',
          user_id: userId,
          transaction_id: data.transaction_id,
          amount: data.amount,
          date: new Date(),
          i_game_id: data.i_action_id
        }

        console.log('step3',betting)

        const balance = data.command === 'bet' 
          ? new BigNumber(user.balance).minus(data.amount).toFixed(0)
          : new BigNumber(user.balance).plus(data.amount).toFixed(0)

        await UserDB.updateOneById(conn)(user.id, {
          balance: Number(balance)
        }).catch(err=>{
          console.log(err)
          throw err;
        })
        await BettingHistoryDB.createBettingHistory(conn)(insertData).catch(err=>{
          console.log(err)
          throw err;
        });
        await BettingStaticsDB.caculateBettingStatics(conn)({
          date: insertData.date,
          user_id: userId,
          game_type
        }, [{
          amount: data.amount,
          command: data.command === 'bet' ? '+':'-',
          field: 'bet_amount',
        }]).catch(err=>{
          console.log(err)
          throw err;
        });
        console.log('step4',betting)
        
        return createSuccessCallback<void>();
      })
    })
  }
)

export default handler;