import { useMutation, useQuery } from "react-query"
import { getFetch } from "../../../utils/getFetch"
import { HttpError } from "react-admin"


export const useReadInbox = () => {
  return useMutation<unknown,HttpError,{id:number}>('/inboxes/read',({id})=>getFetch("POST")(`/api/inboxes/${id}/read`))
}