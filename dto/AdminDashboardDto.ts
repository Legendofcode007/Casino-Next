import { BettingStatistics } from "../entities/betting_statistics"


export type GetDashboardResponse = {
  balance:number,
  unreadCount:number,
  statistic: Pick<BettingStatistics, "bet_amount" | "lost_amount" | "win_amount" >
  agentStatus:boolean
}