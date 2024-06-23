import { useQuery } from "react-query"
import { getFetch } from "../../../utils/getFetch"
import { Bank } from "../../../entities/bank"

export type UserGetBankProps = {
}
export const useGetBank = () => {
  return useQuery<Bank>('getBank',()=>getFetch("GET")('/api/my-account/bank'))
}