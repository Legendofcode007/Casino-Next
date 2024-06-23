import { GetDashboardResponse } from "../../../dto/AdminDashboardDto";
import { dataProvider } from "../dataProvider"
import { useQuery } from 'react-query'

export const useGetDashboard = () => {
  return useQuery<GetDashboardResponse>('dashboard', ()=>dataProvider.getDashboard(),{
    cacheTime: 60000,
    refetchInterval: 60000
  });
}