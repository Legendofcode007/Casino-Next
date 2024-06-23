import { HttpError } from "react-admin"
import { useMutation } from "react-query"
import { dataProvider } from "../dataProvider"




export type UseAnswerCustomerSerivceProps = {
  id:number,
  answer_description:string
}
export const useAnswerCustomerSerivce = () => {
  return useMutation<unknown,HttpError,UseAnswerCustomerSerivceProps>('/costoer-services/[id]/answer',({id,answer_description})=>dataProvider.answerCustomerService(id,{
    answer_description
  }));
}