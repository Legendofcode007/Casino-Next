import { z } from "zod";
import { ExcluedSuperAdminUserRole, UserRole  } from "./user"

export const DepositHistoryStatusZ = z.enum(["success","fail","pending"]);

export type DepositHistoryStatus = z.infer<typeof DepositHistoryStatusZ>;

export type DepositHistory = { 
    id: number;
    user_id: number;
    nick_name: string;
    email: string;
    balace: number;
    role: ExcluedSuperAdminUserRole;
    deposit_amount: number;
    deposit_point: number;
    bank_name: string;
    acc_name: string;
    acc_num: string;
    status: DepositHistoryStatus;
    created_at: Date;
    processed_at: Date;
}