import { z } from "zod";
import { Bank } from "./bank"
import { BettingStatistics } from "./betting_statistics";
import { Rate } from "./rate";

export const UserRolez = z.enum(["user","admin","reseller",'super_admin']);
export type UserRole = z.infer<typeof UserRolez>

export const ExcludeSuperAdminUserRoleZ = UserRolez.exclude(["super_admin"]);
export type ExcluedSuperAdminUserRole = z.infer<typeof ExcludeSuperAdminUserRoleZ>;



export type Reseller = {
    id: number;
    gamer_id: number;
    email: string;
    name: string;
    nick_name: string;
    password: string;
    role: UserRole;
    ip?: string;
    is_active: boolean;
    approved: boolean;
    // banned_users
    banned_info?: BannedInfo;
    // banks
    bank_info?: Bank; 
    // betting_statistic
    betting_statistic?:{
        live: Pick<BettingStatistics,'bet_amount' | 'lost_amount' | 'win_amount'>
        slot: Pick<BettingStatistics,'bet_amount' | 'lost_amount' | 'win_amount'>
    };
    rate_info?: Rate;

    balance: number;
    point: number;
    betting_limit: string;
    winning_limit: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    last_login?: Date | string;
}

export type User =  {
    id: number;
    gamer_id: number;
    email: string;
    name: string;
    nick_name: string;
    password: string;
    role: UserRole;
    ip?: string;
    is_active: boolean;
    approved: boolean;
    // banned_users
    banned_info?: BannedInfo;
    // user_permissions
    permission_info?: UserPermission;
    // banks
    bank_info?: Bank; 
    // betting_statistic
    betting_statistic?: Pick<BettingStatistics,'bet_amount' | 'lost_amount' | 'win_amount'>;
    balance: number;
    point: number;
    phone: string;
    phone_verified: boolean;
    betting_limit: string;
    winning_limit: string;
    referral_code?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    last_login?: Date | string;
}

export type BannedInfo = {
    id: number;
    ip: string;
    user_id: number; // 벤 당한 유저
    banned_by_id: number;
    banned_by_type: Exclude<UserRole, "user">;
    created_at?: Date;
}

export type UserPermission = {
    id: number; 
    user_id: number; //총판 혹은 어드민에게 추천받은 사람
    controller_id: number; // 총판 혹은 어드민
}
