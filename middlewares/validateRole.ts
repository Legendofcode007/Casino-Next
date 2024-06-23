import { getServerSession } from "next-auth/next"
import { UserRole } from "../entities/user"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"; 
import { AuthenticatedUser } from "../dto/AuthenticatedUserDto"
import { getOptions } from "../utils/getNextAuthOptions"


export const validateRole =  (roles:UserRole[],redirect?:string) => (f: (req:NextApiRequest,res:NextApiResponse, user: AuthenticatedUser) => unknown) => async (req:NextApiRequest,res:NextApiResponse) => {
  const session =  await getServerSession(req,res,getOptions(req));
  
  const user = session?.user as AuthenticatedUser;

  if(session?.user && roles.some((role)=>role===user.role)) {
    return await f(req,res,user);

  }
  if(redirect) return res.redirect(redirect);

  if(!user) return res.status(401).send({message: 'Unauthorized Error'});

  return res.status(403).send({message: 'Fobbiden Error'})
}