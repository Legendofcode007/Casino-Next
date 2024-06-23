import type { NextApiRequest, NextApiResponse } from "next";
import { findOneById, findUserById } from "../../../database/users";
// import { findIpById } from "../../../database/banned_users";
import { wrapMiddlewares } from "../../../utils";
import { validateMethods } from "../../../middlewares";
import { getAbleGamingClient } from "../../../modules/api/getClient";
import { connectToDatabase, runTransaction } from "../../../database/connection";
import { CallbackCreditCommand, createFailedCallback, createSuccessCallback } from "../../../modules/api/client";
import * as BettingHistoryDB  from "../../../database/betting_history";
import * as UserDB from "../../../database/users";
import * as BettingStatisticsDB from '../../../database/betting_statistics'

import { BettingResult } from "../../../entities/betting_history";
import BigNumber from "bignumber.js";

const commandToResult = (command: CallbackCreditCommand):BettingResult => command === 'bonus' 
  ? 'bonus'
  : command === 'win' 
    ? 'won'
    : 'cancelled'

const handler = wrapMiddlewares(
  validateMethods(["POST"]),
  async (req: NextApiRequest,res:NextApiResponse) => {
    const clinet = getAbleGamingClient();
    const pool = await connectToDatabase();

    console.log('callback credit')
    console.log(req.body);
    await clinet.callbackCredit(req,res)(async (data)=> {
      return runTransaction(pool)(async (conn)=>{
        const userId = Number(data.user_account);

        const user = await findOneById(pool)(userId);
  
        if(!user) return createFailedCallback('Not Found User');
        let balance = new BigNumber(user.balance); 
        /**
         * 승리 시
         */
        if(data.command === 'win' && Number(data.amount) !== 0) {
          const betting = await BettingHistoryDB.findOne(conn)({
            transaction_id: data.match_transaction_id,
            result:'bet',
            user_id:userId
          }).catch(err=>{
            console.log(err);
            throw err;
          })
          console.log('win',betting)
          if(!betting) return createFailedCallback('Not Found Bet');
          balance = balance.plus(data.amount);
          await UserDB.updateOneById(conn)(userId,{
            balance: Number(balance.toFixed(0))
          }).catch(err=>{
            console.log(err);
            throw err;
          })
          const inputData:BettingHistoryDB.CreateBettingHistoryInput = {
            amount: data.amount,
            date: new Date(),
            game_key:data.game_key,
            game_type:betting?.game_type,
            i_action_id:data.i_action_id,
            i_game_id:data.i_game_id,
            result: 'won',
            transaction_id:data.transaction_id,
            user_id:userId,
            vendor_key:data.vendor_key
          }
          await BettingHistoryDB.createBettingHistory(conn)(inputData).catch(err=>{
            console.log(err);
            throw err;
          })

          await BettingStatisticsDB.caculateBettingStatics(conn)({
            date: inputData.date,
            user_id: userId,
            game_type: betting.game_type,
          }, [{
            amount: data.amount,
            command:'+',
            field:'win_amount',
          }]).catch(err=>{
            console.log(err);
            throw err;
          })
        } 
        /**
         * 패배 시
         */
        else if (data.command === 'win' && Number(data.amount) === 0) {
          const betting = await BettingHistoryDB.findOne(conn)({
            transaction_id: data.match_transaction_id,
            result:'bet',
            user_id:userId
          }).catch(err=>{
            console.log(err);
            throw err;
          })

          console.log(betting)

          if(!betting) return createFailedCallback('Not Found Bet');

          balance = balance.minus(betting.amount)
          
          const inputData:BettingHistoryDB.CreateBettingHistoryInput = {
            amount: data.amount,
            date: new Date(),
            game_key:data.game_key,
            game_type:betting.game_type,
            i_action_id:data.i_action_id,
            i_game_id:data.i_game_id,
            result: 'lost',
            transaction_id:data.transaction_id,
            user_id:userId,
            vendor_key:data.vendor_key
          }
          await BettingHistoryDB.createBettingHistory(conn)(inputData).catch(err=>{
            console.log(err);
            throw err;
          })

          await BettingStatisticsDB.caculateBettingStatics(conn)({
            date: inputData.date,
            user_id: userId,
            game_type: betting.game_type
          }, [{
            amount: betting.amount,
            command:'+',
            field:'lost_amount',
          }]).catch(err=>{
            console.log(err);
            throw err;
          })

        }
        return {
          data: {
            status: true,
            balance: balance.toFixed(2)
          }
        }
      })
    })
  }
)

export default handler;