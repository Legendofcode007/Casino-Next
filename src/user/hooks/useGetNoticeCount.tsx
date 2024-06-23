import { useQuery } from "react-query"
import { getFetch } from "../../../utils/getFetch"

export type UserGetNoticeCountProps = {
}
export const useGetNoticeCount = () => {
  return useQuery<{count:number}>('GetNoticeCount',()=>getFetch("GET")('/api/notices/count'))
}