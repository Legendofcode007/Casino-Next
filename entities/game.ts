

export type Game = {
    id: number;
    game_id: number;
    provider_id: number;
    vendor_key: string;
    vendor_title: string;
    type: string;
    sub_type:string;
    thumbnail: string;
    title: string;
    title_ko: string;
    game_key: string;
    max_betting_balance: number;
    min_betting_balance: number;
    callback_key: string;
    callback_key_mobile: string;
    is_active: number;
}