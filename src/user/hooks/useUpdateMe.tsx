import { useMutation, useQuery } from "react-query"
import { getFetch } from "../../../utils/getFetch"
import { HttpError } from "react-admin"
import { UpdateUserBodyDto } from "../../../dto/UserDto"

export type UseUpdateMeProps = {
}
export const useUpdateMe = () => {
  return useMutation<{id:number},HttpError,UpdateUserBodyDto>('updateBacnk',({name})=>getFetch("PUT")('/api/auth/me',{
    body: JSON.stringify({
      name
    })
  }))
}