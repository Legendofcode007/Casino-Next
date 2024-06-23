import { ZodAny, z } from 'zod'


export const zodReactAdminValidate =  <T = unknown>(zod: z.AnyZodObject) =>(valude: T) => {
  const res = zod.safeParse(valude);
  if(!res.success) {
    return res.error.errors.reduce((prev,next)=>{
      return {
        ...prev,
        [`${next.path}`]:next.message
      }
    },{})
  }
  return true;
}