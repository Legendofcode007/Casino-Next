import {
  TextField,
  FunctionField,
  TextInput,
  TopToolbar,
  FilterButton,
  NumberField,
  useNotify,
  DateInput,
  useRedirect,
  useRefresh
} from "react-admin";
import { Chip, CircularProgress, Grid, Paper, Stack } from "@mui/material";
import { useLocation } from "react-router-dom";
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from "next/router";
import { useRecordContext } from 'react-admin';
import { stringify } from 'qs'
import { BreadCrumbs } from "../components/BreadCrumbs"
import { QuickFilter } from "../components/QucickFilter";
import { BooleanIcon } from "../components/BooleanIcon";
import { useMemo, useState } from "react";
import { CreateButton } from "../components/CreateButton"
import {  List } from "../components/DataGrid"
import { useToggleBan } from "../hooks/useToggleBan";
import { format } from 'date-fns'
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Reseller, User } from "../../../entities/user";
import { SimpleTable } from "../components/SimpleTable";
import { useGetDashboard } from "../hooks/useGetDashboard";
import BigNumber from "bignumber.js";
import { BettingStatistics } from "../../../entities/betting_statistics";
import { 
  function as F,
  number as N,
  string as S
} from 'fp-ts'
import { CustomerDialog } from "./CustomerDialog";

export type StatusticSimpleTableProps = {
  statisic?: Pick<BettingStatistics, 'bet_amount' | 'win_amount' | 'lost_amount'>,
  ggr?: string | number;
  rolling?: string | number;
}
const StatusticSimpleTable = ({statisic,ggr,rolling}:StatusticSimpleTableProps) => {
  const user_income = new BigNumber(statisic?.bet_amount ?? 0).minus(statisic?.win_amount ?? 0);
  const bet_amount = new BigNumber(statisic?.bet_amount ?? 0)
  return <SimpleTable sx={{width:500}}>
    <Grid2 xs={3} minHeight={20} textAlign={'center'}  >
      고객 총 배팅액
    </Grid2>
    <Grid2 xs={3} minHeight={20}>
      고객 총 수익
    </Grid2>
    <Grid2 xs={3} minHeight={20}>
      총판 ggr 수익
    </Grid2>
    <Grid2 xs={3} minHeight={20}>
      총판 rolling 수익
    </Grid2>
    <Grid2 xs={3} minHeight={20} sx={{textAlign:'right'}}>
    {
      Number(bet_amount.toFixed(0)).toLocaleString()
    }
    </Grid2>
    <Grid2 xs={3} minHeight={20} sx={{textAlign:'right'}}>
      {Number(statisic?.win_amount ?? 0).toLocaleString()}
    </Grid2>
    <Grid2 xs={3} minHeight={20} sx={{textAlign:'right'}}>
      {
        Number(
          user_income.lte(0) 
          ? 0
          : user_income
              .multipliedBy(new BigNumber(ggr ?? 0)
              .dividedBy(100))
              .toFixed(0)
        ).toLocaleString()
      }
    </Grid2>
    <Grid2 xs={3} minHeight={20} sx={{textAlign:'right'}}>
      { Number(
         bet_amount?.multipliedBy(new BigNumber(rolling ?? 0)
          .dividedBy(100))
          .toFixed(0)
        ).toLocaleString()
      }
    </Grid2>



  </SimpleTable>
}


export const ViewUsers = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const search = useLocation().search;
  const [viewId, setViewId] = useState<null|number>(null)


  return (
    <Stack direction={"column"}>
      <BreadCrumbs items={[{name:"총판"},{name:"총판목록"}]} />
      {!!viewId && <CustomerDialog id={viewId} onClose={()=>setViewId(null)}/>}
      <List 
        filterDefaultValues={{
          start_date: new Date(),
          end_date:new Date()
        }}
        filters={[
          <TextInput key={1} label="Search" source="q" placeholder='이름,닉네임 검색' alwaysOn/>,
          <DateInput key={4} label="시작날짜" source="start_date" placeholder="시작날짜" alwaysOn onChange={(e)=>console.log(e.target.value)}  />,
          <DateInput key={5} label="종료날짜" source="end_date" placeholder="종료날짜" alwaysOn />,
        ]}
       
        actions={<TopToolbar>
          <FilterButton disableSaveQuery />
        </TopToolbar>}
        className="mt-0 py-0"
        sort={{ field: "id", order: "DESC" }}
        
        datagridProps={{
          bulkActionButtons:false,
          size:"medium"
        }}
      >
        <TextField label={t('ID')}  source="id" />
        <TextField label={t('Name')} source="name" />
        <TextField  label={t('Nick_Name')} source="nick_name" />
      
        <FunctionField label="카지노 수수료율"  render={(record:Reseller)=>{
          return <SimpleTable sx={{width:200}}>
            <Grid2 xs={6} minHeight={20} textAlign={'center'}  >
              rolling
            </Grid2>
            <Grid2 xs={6} minHeight={20} textAlign={'center'} >
              grr
            </Grid2>
            <Grid2 xs={6} minHeight={20} sx={{textAlign:'right'}}>
              {record.rate_info?.casino_rolling}%
            </Grid2>
            <Grid2 xs={6} minHeight={20} sx={{textAlign:'right'}}>
              {record.rate_info?.casino_ggr}%
            </Grid2>
          </SimpleTable>
        }}></FunctionField>
        <FunctionField label="카지노 통계" render={(record:Reseller)=>{
          return <StatusticSimpleTable 
            statisic={record?.betting_statistic?.live} 
            ggr={record?.rate_info?.casino_ggr} 
            rolling={record?.rate_info?.casino_rolling}
            /> 
        }}>
        </FunctionField>


        <FunctionField label="슬롯 수수료율"  render={(record:Reseller)=>{
          return <SimpleTable sx={{width:200}}>
            <Grid2 xs={6} minHeight={20} textAlign={'center'}  >
              rolling
            </Grid2>
            <Grid2 xs={6} minHeight={20} textAlign={'center'} >
              grr
            </Grid2>
            <Grid2 xs={6} minHeight={20} sx={{textAlign:'right'}}>
              {record.rate_info?.slot_rolling}%
            </Grid2>
            <Grid2 xs={6} minHeight={20} sx={{textAlign:'right'}}>
              {record.rate_info?.slot_ggr}%
            </Grid2>
          </SimpleTable>
        }}></FunctionField>
       
        
        <FunctionField label="슬롯 통계" render={(record:Reseller)=>{
          return <StatusticSimpleTable 
            statisic={record?.betting_statistic?.slot}
            ggr={record?.rate_info?.slot_ggr} 
            rolling={record?.rate_info?.slot_rolling}
          /> 
        }}></FunctionField>

        <FunctionField label="비고" render={(record)=> {
          return <Stack direction={'row'} spacing={1}>
            {/* <Chip size='medium' clickable  label='수정' color="info" onClick={()=>setUserInfoDialogId(record?.id)}/> */}
            <Chip clickable  label='고객보기' color="info" onClick={()=>setViewId(record?.id)}/>
          </Stack>
        }}></FunctionField>

      </List>
    </Stack>
  );
};


export default ViewUsers;