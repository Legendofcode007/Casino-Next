import { UserRole } from "./user"

export type GameType = 'slot' | 'live';
export type BettingResult = 'won' | 'lost' | 'cancelled' | 'bet' | 'bonus';

export type BettingHistory = {
    id: number;
    user_id: number;
    i_game_id: string;
    i_action_id: string;
    vendor_key: string;
    game_key: string;
    transaction_id: string;
    game_type: GameType;
    amount: string;
    result: BettingResult;
    date: Date;
}