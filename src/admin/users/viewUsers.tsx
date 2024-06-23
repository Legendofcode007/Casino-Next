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
  useRefresh,
  RadioButtonGroupInput,
  BooleanInput
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
import { CreateUserDialog } from "./CreateUserDialog"
import { CreateButton } from "../components/CreateButton"
import { UserInfoDialog } from "./UserInfoDialog"
import {  List } from "../components/DataGrid"
import { useToggleBan } from "../hooks/useToggleBan";
import { format } from 'date-fns'
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { User } from "../../../entities/user";
import { SimpleTable } from "../components/SimpleTable";
import { useGetDashboard } from "../hooks/useGetDashboard";
import BigNumber from "bignumber.js";

type BannChipProps = {
  userId: number;
  isBanned: boolean;
}
export const BannChip = ({isBanned,userId}:BannChipProps) => {
  const {mutate,data,isError,isLoading} = useToggleBan();
  const notify = useNotify();
  const refresh = useRefresh()
  const message = useMemo(()=>{
    return isBanned ? '차단 해제하시겠습니까?':'차단 하시겠습니까?'
  },[isBanned])
  const successMessage = useMemo(()=>{
    return isBanned ? '차단 해제 되었습니다':'차단 되었습니다.'
  },[isBanned])
  const label = useMemo(()=>isBanned ? '차단 해제':'차단',[isBanned]);
  const color = useMemo(()=>isBanned ? 'success':'error',[isBanned]);
  const onClick = () => {
    if(confirm(message)) {
      mutate({
        user_id:userId
      },{
        onError: (error )=> {
          notify(error.message?.message,{
            type:'error'
          })
        },
        onSuccess: () => {
          notify(successMessage)
          refresh();
        }
      })
    }
  }
  return (
    <Chip clickable label={label} color={color} onClick={onClick}/>
  )

}


export const ViewUsers = () => {
  const [createDialog,setCreateDialog] = useState(false);
  const { t } = useTranslation('common');
  const [userInfoDialogId, setUserInfoDialogId ] = useState<number|null>(null);

  return (
    <Stack direction={"column"}>
      <BreadCrumbs items={[{name:"회원관리"},{name:"회원목록"}]} />


      <CreateUserDialog open={createDialog} onClose={setCreateDialog}/>
      {userInfoDialogId ? <UserInfoDialog id={userInfoDialogId} onClose={()=>setUserInfoDialogId(null)}/>:<></>}
      <List 
        filterDefaultValues={{
          start_date: new Date(),
          end_date:new Date()
        }}
        filters={[
          <TextInput key={1} label="Search" source="q" placeholder='이름,닉네임 검색' alwaysOn/>,
          <DateInput key={2} label="시작날짜" source="start_date" placeholder="시작날짜" alwaysOn  />,
          <DateInput key={3} label="종료날짜" source="end_date" placeholder="종료날짜" alwaysOn />,
          <RadioButtonGroupInput key={4} label="권한" choices={[
            {id: 'user', name: '유저'},
            {id: 'resller', name: '총판'},
            {id: 'admin', name: '관리자'},
          ]} optionValue="id"  source="role"/>,
          <BooleanInput key={5} label="벤여부" source="isBanned" />,
          <BooleanInput key={6} label="승인여부" source="isApproved"/>,

          // <QuickFilter key={2}  label="밴유저만" source="isBanned" defaultValue={true}/>,
          // <QuickFilter key={3}  label="승인대기중만" source="isApproved" defaultValue={false}/>
        ]}
       
        actions={<TopToolbar>
          <FilterButton disableSaveQuery />
          <CreateButton onClick={()=>setCreateDialog(true)}>추가</CreateButton>
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
        <NumberField sx={{minWidth:120}} label={t('Balance')} sortable={false} source="balance" />
        <NumberField sx={{minWidth:120}} label={t('Point')} sortable={false} source="point" />
      

        <FunctionField label="통계" render={(record:User)=>{
          return <SimpleTable>
            <Grid2 xs={3} minHeight={20} textAlign={'center'}  >
              총 배팅액
            </Grid2>
            <Grid2 xs={3} minHeight={20}>
              총 수익
            </Grid2>
            <Grid2 xs={3} minHeight={20}>
              총 손해
            </Grid2>
            <Grid2 xs={3} minHeight={20}>
              플랫폼 수익
            </Grid2>
            <Grid2 xs={3} minHeight={20}>
              {record.betting_statistic?.bet_amount ?? 0}
            </Grid2>
            <Grid2 xs={3} minHeight={20}>
              {record.betting_statistic?.win_amount ?? 0}
            </Grid2>
            <Grid2 xs={3} minHeight={20}>
              {record.betting_statistic?.lost_amount ?? 0}
            </Grid2>

            <Grid2 xs={3} minHeight={20}>
              {(new BigNumber(record.betting_statistic?.bet_amount ?? 0).minus(record.betting_statistic?.win_amount ?? 0).toFixed(0))}
            </Grid2>
        
          </SimpleTable>
        }}>

        </FunctionField>
        {/* <FunctionField label={t('Is_Active')} render={(record,source)=>{
          return <BooleanIcon bool={record?.is_active===1}/>
        }}/> */}
        <FunctionField label={t('Approved')} render={(record,source)=>{
          return <BooleanIcon bool={record?.approved===1}/>
        }}/>

        <FunctionField label="비고" render={(record)=> {
          return <Stack direction={'row'} spacing={1}>
            {/* <Chip size='medium' clickable  label='수정' color="info" onClick={()=>setUserInfoDialogId(record?.id)}/> */}
            <BannChip userId={record.id} isBanned={!!record.banned_info}/>
            <Chip clickable  label='더보기' color="info" onClick={()=>setUserInfoDialogId(record?.id)}/>
          </Stack>
        }}></FunctionField>

      </List>
    </Stack>
  );
};


export default ViewUsers;