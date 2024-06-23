import { NextApiRequest, NextApiResponse } from "next"


export type MiddleWareF0 = (req:NextApiRequest,res:NextApiResponse) => unknown;
export type MiddleWareF1<Args1 = unknown> = (req:NextApiRequest,res:NextApiResponse,args1: Args1) => unknown;
export type MiddleWareF2<Args1 = unknown,Args2 =unknown > = (req:NextApiRequest,res:NextApiResponse,args1: Args1,args2:Args2) => unknown;
export type MiddleWareF3<Args1 = unknown,Args2 =unknown,Args3 =unknown > = (req:NextApiRequest,res:NextApiResponse,args1:Args1,args2:Args2,args3:Args3) => unknown;

export type MiddleWareF = MiddleWareF0 | MiddleWareF1 | MiddleWareF2 | MiddleWareF3;


export function wrapMiddlewares(...functions: MiddleWareF[]):MiddleWareF0 { 
  return async (req:NextApiRequest,res:NextApiResponse,...args) => {

    for(const f of functions) {
      if(typeof f === 'function') {
        try {

          await (f as any)(req,res,...args);
          
        }catch(err) {
          console.log(err);

          if(!res.headersSent) return res.status(500).send({message:'작업 중 오류'})
        }finally {
          if(res.headersSent) {
            return;
          }
        }
      }
    }
  }
}