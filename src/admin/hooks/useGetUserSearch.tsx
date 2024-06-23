import { QueryKey, UseQueryOptions, useQuery } from "react-query"
import { dataProvider } from "../dataProvider"
import { ExcluedSuperAdminUserRole, User } from "../../../entities/user"
import { HttpError } from "react-admin"



export type UseGetUserSearchProps = {
    q: string,
    role?: ExcluedSuperAdminUserRole,
}
export const useGetUserSearch = (props:UseGetUserSearchProps,options?: Omit<UseQueryOptions<UseGetUserSearchProps, HttpError, User[], QueryKey>, "queryKey" | "queryFn"> | undefined ) => {

  return useQuery<UseGetUserSearchProps,HttpError,User[]>('useGetUserSearch',()=>dataProvider.getUserSearch(props.q,props.role),options)
}