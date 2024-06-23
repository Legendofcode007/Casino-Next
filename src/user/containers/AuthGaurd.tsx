import { useSession } from "next-auth/react"
import { useEffect } from "react";
import { AuthenticatedUser } from "../../../dto/AuthenticatedUserDto";
import { TextField,TextFieldProps } from "@mui/material";
import { useRouter } from "next/router";




export type AuthGuardProps = {
  children: (user: AuthenticatedUser) => React.ReactNode,
  redirect?: string
}
export const AuthGaurd = ({children,redirect}:AuthGuardProps) => {
  const {data,status} = useSession();
  const router = useRouter()
  useEffect(()=>{
    if(status === 'unauthenticated' && redirect) {
      router.replace(redirect)
    } 
  },[status,redirect])

  if(status === 'loading') return <></>;
  if(status === 'unauthenticated') return <></>
  return children(data?.user as any);
}