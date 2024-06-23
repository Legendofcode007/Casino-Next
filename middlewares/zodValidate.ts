import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { MiddleWareF } from '../utils'

export type ZodValidationProps = {
  body?: z.AnyZodObject,
  query?: z.AnyZodObject
} 

export const zodValdate = (props?:ZodValidationProps) => (req:NextApiRequest,res:NextApiResponse) => {

  for(const v of Object.keys(props ?? {})) {
    const result = props?.[v as unknown as keyof ZodValidationProps]?.safeParse(req[v as unknown as keyof NextApiRequest])

    if(!result?.success){
      const error = result?.error.errors[0];
      const paths = [v, ...(error?.path ?? [])];
      const message = `[${paths.join('.')}]: ${error?.message}`
      return res.status(400).send({message});
    }
  }
}