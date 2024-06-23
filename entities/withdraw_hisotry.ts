import { z } from "zod";
import { ExcluedSuperAdminUserRole, UserRole  } from "./user"
import { DepositHistoryStatusZ } from "./deposit_history"

export const WithdRawHistoryStatusZ = DepositHistoryStatusZ;
export type WithdrawHistoryStatus = z.infer<typeof WithdRawHistoryStatusZ>;

export type WithdrawHistory = { 
    id: number;
    user_id: number;
    nick_name: string;
    email: string;
    balace: number;
    role: ExcluedSuperAdminUserRole;
    balance_before: number;
    withdraw_amount: number;
    bank_name: string;
    acc_name: string;
    acc_num: string;
    status: WithdrawHistoryStatus;
    created_at: Date;
    processed_at: Date;
}