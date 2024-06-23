import { useMutation, useQuery } from "react-query"
import { getFetch } from "../../../utils/getFetch"
import { HttpError } from "react-admin"


export const useExchangePoint = () => {
  return useMutation<unknown,HttpError,void>('/my-account/exchange',()=>getFetch("POST")(`/api/my-account/exchange`))
}