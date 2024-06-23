import { useQuery } from "react-query"
import { getFetch } from "../../../utils/getFetch"
import { UserMeDto } from "../../../dto/UserDto"
export type UserGetMeProps = {
}
export const useGetMe = () => {
  return useQuery<UserMeDto>('getMe',()=>getFetch("GET")('/api/auth/me'))
}