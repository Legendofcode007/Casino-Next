import { HttpError } from "react-admin"
import { useMutation } from "react-query"
import { dataProvider } from "../dataProvider"




export type UseTobblebannprops = {
    user_id: number
}
export const useToggleBan = () => {
  return useMutation<unknown,HttpError,{user_id:number}>('toggle-ban',({user_id})=>dataProvider.toggleBan(user_id));
}