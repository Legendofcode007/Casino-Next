import { useMutation, useQuery } from "react-query"
import { getFetch } from "../../../utils/getFetch"
import { HttpError } from "react-admin"
import { CreateCustomerServiceBodyDto } from "../../../dto/CustomerServiceDto"

export type UseCreateCustomerServiceProps = {
}
export const useCreateCustomerService = () => {
  return useMutation<void,HttpError,CreateCustomerServiceBodyDto>('/cs',({title,description})=>getFetch("POST")('/api/cs/create',{
    body: JSON.stringify({
      title,
      description
    })
  }))
}