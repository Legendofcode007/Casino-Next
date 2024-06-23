import { useQuery } from "react-query"
import { getFetch } from "../../../utils/getFetch"

export type UserGetUnreadCountProps = {
  cache? :RequestCache
}
export const useGetUnreadCount = ({cache}:UserGetUnreadCountProps = {}) => {
  return useQuery<{count:number}>('GetUnreadCount',()=>getFetch("GET")('/api/inboxes/count',{
    cache
  }))
}