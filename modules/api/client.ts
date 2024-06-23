import { AxiosInstance, default as axios} from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { Hmac, createHmac } from "node:crypto"

export const createFailedCallback = (message:string):AbleGamingResponse<{status:boolean}> => ({
  data: {
    status: false
  },
  error: message
})

export const createSuccessCallback = <T>(data: T | void):AbleGamingResponse<T extends void ? {status:boolean}:({sataus:boolean} & T)> =>({
  data: {
    status:true,
    ...(data ?? {})
  } as any
})

export class AbleGamingClient {
  private http: AxiosInstance;
  private apiKey: string;
  private callbackSecretKey: string;

  constructor(options: AbleGamingClientOptions) {
    this.http = axios.create({
      baseURL: options.url,
      headers: {
        "Authorization": options.apiKey
      },
      timeout: 10000
    });
    this.apiKey = options.apiKey;
    this.callbackSecretKey = options.callbackSecretKey;
  }


  /**
   * 
   * @param account 가입한 유저 아이디
   */
  async getUser(account: string) {
    const res = await this.http.post<GetUserResponse>('/api/user/getUser',{
      account
    })

    return res.data;
  }

  async createUser(account:string,nickname:string) {
    const res = await this.http.post<CreateUserResponse>('/api/user/createUser', {
      account,
      nickname
    });

    return res.data;
  }

  async deposit(account: string,balance:number) {
    const res = await this.http.post<DepositResponse>('/api/user/deposit', {
      account,
      balance
    });

    return res.data;
  }

  async withdraw(account: string,balance:number) {
    const res = await this.http.post<WithdrawResponse>('/api/user/withdraw',{
      account,
      balance
    });

    return res.data
  }


  async getLobbyUrl(data?:GetLobbyUrlBody) {
    const res = await this.http.post<GetLobbyUrlResponse>('/api/user/getLobbyUrl', data);
   
    return res.data;
  }
  /**
   * 현재 사용하는 apikey를 사용하는 어드민의 정보를 확인하는 api
   * @returns 
   */
  async getAgentInfo() {
    const res = await this.http.post<GetAgentInfoResponse>('/api/user/getAgentInfo',null,{
      timeout: 2000
    });

    return res.data;
  }


  async getVendors(data?: GetGamesBody) {
    const res = await this.http.post<GetVendorsResponse>('/api/user/getVendors',data);

    return res.data;
  }
  async getGames(data?: GetGamesBody) {
    const res = await this.http.post<GetGamesResponse>('/api/user/getGames',data);

    return res.data;
  }

  // async getLobbyUrl() {

  // }

  async getGameUrl(data?: GetGameUrlBody) {
    const res = await this.http.post<GetGameUrlResponse>('/api/user/getGameUrl', data);

    return res.data;
  }

  /**
   * 사용자 balance Callback 함수
   * @param req 
   * @param res 
   * @returns 
   */
  callbackBalance(req: NextApiRequest,res:NextApiResponse) {
    // res.setHeader('secret_key',this.callbackSecretKey);
    const validate = this.CheckMatchSecretKeyOrError(req); 
    return async (f: (account: string)=>Promise<AbleGamingResponse<{status: boolean,balance?: string}>> ) => {
      const body: { user_account:string, hmac:string} = req.body;
      const account = body.user_account
      if(validate) return res.status(200).send(validate); 
      // const result = createHmac('SHA256', this.callbackSecretKey)
      //   .update(body.hmac)
      //   .digest()
      //   .toString("base64")
      // console.log(result)
      await f(account)
        .then((result)=>{
          res.status(200).json(result)
        })
        .catch(err => {
          res.status(200).json({
            error: 'server system error',
            data: {
              status:false
            }
          })
        })
    }
  }

  /**
   * 사용자 배팅,배팅취소 콜백 함수
   * @param req 
   * @param res 
   */
  callbackDebit(req: NextApiRequest,res:NextApiResponse) {
    // res.setHeader('secret_key',this.callbackSecretKey);
    const validate = this.CheckMatchSecretKeyOrError(req); 

    return async (f: CallbackDebitFunction ) => {
      if(validate) return res.status(200).send(validate); 

      await f(req.body as any)
        .then((result)=>{
          res.status(200).json(result)
        })
        .catch(err => {
          res.status(200).json({
            error: 'server system error',
            data: {
              status:false
            }
          })
        })
    }
  }

  /**
   * 사용자 배팅 당첨, 당첨 취소, 보너스
   * @param req 
   * @param res 
   * @returns 
   */
  callbackCredit(req:NextApiRequest, res:NextApiResponse) {
    // res.setHeader('secret_key',this.callbackSecretKey);
    const validate = this.CheckMatchSecretKeyOrError(req); 

    return async (f: CallbackCreditFunction ) => {
      if(validate) return res.status(200).send(validate); 

      await f(req.body as any)
        .then((result)=>{
          res.status(200).json(result)
        })
        .catch(err => {
          res.status(200).json({
            error: 'server system error',
            data: {
              status:false
            }
          })
        })
    }
  }
  
  private CheckMatchSecretKeyOrError(req:NextApiRequest) {
    console.log('match secret_key: ',
      req.headers["secret_key"] !== this.callbackSecretKey,
      req.headers["secret_key"],
      this.callbackSecretKey
    )
    if(req.headers["secret_key"] !== this.callbackSecretKey) {
      return {
        error: 'Not Matched Secrect Key'
      }
    }

    return null;
  }

  // async searchGameDetails() {

  // }

  // async getTransactions() {

  // }

  // async getTransactionInfo(){

  // }

  // async getGameDetails() {

  // }

}



export type AbleGamingResponse<T> = {
  error?: string;
  data: T
}

export type AbleGamingClientOptions = {
  url: string,
  apiKey: string,
  callbackSecretKey: string
}

export type GetUserResponse = AbleGamingResponse<{userInfo:AbleGamingUserInfo}>;
export type CreateUserResponse = AbleGamingResponse<AbleGamingUserInfo>
export type DepositResponse = AbleGamingResponse<{result:boolean}>
export type WithdrawResponse = DepositResponse;
export type GetGamesResponse = AbleGamingResponse<{
  count: number,
  games: AbleGamingGameInfo[]
}>

export type GetVendorsResponse = AbleGamingResponse<{
  count: number,
  vendors: AbleGamingVendorInfo[]
}>

export type GetLobbyUrlResponse = AbleGamingResponse<{
  html: string;
  url: string;
}>

export type GetGameUrlResponse = AbleGamingResponse<{
  html: string;
  url: string;
}>
export type GetAgentInfoResponse = AbleGamingResponse<{
  balance: number;
}>;


export type CallbackDebitFunction = (body: CallbackDebitBody) => Promise<AbleGamingResponse<{status:boolean}>>
export type CallbackCreditFunction = (body: CallbackCreditBody) => Promise<AbleGamingResponse<{status:boolean,balance?:string}>>


export type CallbackDebitBody = {
  user_account:string
  i_game_id: string
  i_action_id: string
  vendor_key: string
  game_type: GameType;
  game_key: string
  transaction_id: string
  amount: string
  command: CallbackDebitCommand;
  match_transaction_id?: string // 배팅 취소시에 배팅한 transaction_id를 가져옴
}

export type CallbackCreditBody = Omit<CallbackDebitBody, 'command'> & {
  command: CallbackCreditCommand
}


export type GetGamesBody = {
  page?:number;
  limit?:number;
  vendor_key?:string;
}

export type GetLobbyUrlBody = {
  vendor_key: string;
  account: string;
  is_mobile: boolean;
  user_ip: string;
}

export type GetGameUrlBody = {
  game_key: string;
  account: string;
  is_mobile: boolean;
  user_ip: string;
}

export type AbleGamingVendorInfo = {
  id: string;
  type: GameType;
  sub_type: string;
  title:string;
  title_ko:string;
  vendor_key: string;
  thumbnail: string;
  created_at: string;
  modified_at: string;
  removed_at?: string;
  is_disabled: number;
  max_betting_balance?: string;
  lobby_key: string;
  sort_key? :string;
  min_betting_balance?: string;
}

export type AbleGamingGameInfo = {
  id:number;
  type: GameType; // slot
  sub_type: string // Slots
  vendor_key: string;
  title: string;
  title_ko: string;
  game_key: string;
  thumbnail: string;
  created_at: string;
  modified_at: string;
  removed_at?: string;
  is_disabled: boolean;
  max_betting_balance: number;
  min_betting_balance: number;
  callback_key_mobile: string;
  callback_key: string;
  vendor_title: string;
}

export type AbleGamingUserInfo = {
  id: number;
  account: string;
  nickname: string;
  group?:string;
  state: string;
  memo?: string;
  balance: number;
  created_at: string;
  modified_at: string;
  removed_at?: string;
  vender_setting?: Record<string, {
    max_betting_balance?: string;
    min_betting_balance?: string;
  }>;
  currency: "KRW" | "USD";
  language: "ko" | "en";
}



export type GameType = 'slot' | 'casino';

export type CallbackDebitCommand = 'bet' | 'cancel';
export type CallbackCreditCommand = 'win' | 'cancel' | 'bonus';
