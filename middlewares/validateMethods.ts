import { NextApiRequest, NextApiResponse } from "next"
import { MiddleWareF } from "../utils/warpMiddlewares"
import { zodValdate } from "./zodValidate"
import { 
  function as F
} from 'fp-ts'

export type HttpMethod = 'GET' | 'POST' | 'DELTE' | 'PUT' | 'PATCH'

export const validateMethods = (methods: HttpMethod[]):MiddleWareF => async (req,res) => {
  if(!methods.some(v => v.toUpperCase()===req.method?.toUpperCase())) {
    return res.status(500).send({message:  "Route not valid"});
  }
}

// function methodOrPass(method:HttpMethod): (f:(req:NextApiRequest,res:NextApiResponse) => unknown)
//   => (req:NextApiRequest,res:NextApiResponse) => unknown;
function methodOrPass(method:HttpMethod):  <Args1 = unknown>(f:(req:NextApiRequest,res:NextApiResponse, args1: Args1) => unknown)
  => (req:NextApiRequest,res:NextApiResponse, args1: Args1) => unknown;
function methodOrPass(method:HttpMethod): <Args1 = unknown,Args2 = unknown>(f: (req:NextApiRequest,res:NextApiResponse,args1: Args1,args2: Args2)=>unknown) => (req:NextApiRequest,res:NextApiResponse,args1: Args1,args2: Args2)=>unknown;
function methodOrPass(method:HttpMethod) {
  return (f:any) => async (req:NextApiRequest,res:NextApiResponse,...args: any[]) => {
    if(req.method?.toUpperCase() === method.toLocaleUpperCase()) {
      await f(req,res,...args);
    }
  }
}

export const POST = methodOrPass("POST")

export const GET = methodOrPass("GET")

export const PATCH = methodOrPass("PATCH")

export const PUT = methodOrPass("PUT")

export const DELETE = methodOrPass("DELTE")