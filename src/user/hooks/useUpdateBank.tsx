import { useMutation, useQuery } from "react-query"
import { getFetch } from "../../../utils/getFetch"
import { Bank } from "../../../entities/bank"
import { HttpError } from "react-admin"
import { UpdateBankInput } from "../../../database/banks"

export type UseUpdateBankProps = {
}
export const useUpdateBank = () => {
  return useMutation<Bank,HttpError,UpdateBankInput>('updateBacnk',({acc_name,acc_num,bank_name})=>getFetch("PUT")('/api/bank',{
    body: JSON.stringify({
      acc_name,
      acc_num,
      bank_name
    })
  }))
}