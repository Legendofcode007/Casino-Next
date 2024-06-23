import simpleRestProvider from "ra-data-simple-rest";
import { fetchUtils } from "react-admin";
import { ExcluedSuperAdminUserRole } from "../../entities/user";
import { AnswerByIdInput } from "../../database/admin/customer_services";
import { getFetch } from "../../utils/getFetch";

export const dataProvider = {
  ...simpleRestProvider(
    "/api/admin",
    fetchUtils.fetchJson,
    "X-Total-Count"
  ),
  getDashboard: () => fetch(`/api/admin/dashboards`, {method: 'GET'}).then(
    response=>response.json()
  ),
  toggleBan: (user_id: number) => fetch('/api/admin/toggle-ban', {
    method:'POST',
    headers: {
      'Content-Type':'application/json',
    },
    body: JSON.stringify({
      user_id
    })
  }).then(response=> response.json()),
  getUserSearch: (q:string,role?:ExcluedSuperAdminUserRole) => fetch(`/api/admin/users/search?q=${q}${role ? '&role='+role:''}`, {
    method:'GET'
  }).then(response => response.json()),
  answerCustomerService: (id:number,input:AnswerByIdInput) => getFetch("POST")(`/api/admin/customer-services/${id}/answer`,{
    body:JSON.stringify(input)
  })
}