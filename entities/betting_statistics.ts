import { GameType } from "./betting_history";



export type BettingStatistics = {
    id: number;
    user_id: number;
    bet_amount: string;
    win_amount: string;
    lost_amount: string;
    game_type: GameType;
    date: string;
}