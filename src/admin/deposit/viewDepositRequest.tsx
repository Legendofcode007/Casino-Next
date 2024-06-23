import { Datagrid, TextField, FunctionField, Form, SaveButton, TextInput, SelectInput,SimpleShowLayout, DateInput, RadioButtonGroupInput, NumberField, Toolbar, FilterButton, TopToolbar, DateField, useUpdate, useNotify, useRefresh, HttpError } from "react-admin";
import { Typography, Grid, Stack, Chip, ButtonGroup, Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from "next/router";
import { useRecordContext } from 'react-admin';
import { BreadCrumbs } from "../components/BreadCrumbs";
import { QuickFilter } from "../components/QucickFilter";
import { useMemo, useState } from "react";
import { format } from 'date-fns'
import { List } from "../components/DataGrid";
import { DepositHistoryStatus } from "../../../entities/deposit_history";
import { UpdateDepositDialog } from "./UpdateDepositDialog"
type StatusChipProps = {
  status: DepositHistoryStatus
}
const StatusChip = ({status}:StatusChipProps) => {
  if(status === 'success') return <Chip color="success" variant="outlined" label="완료됨"></Chip>
  else if(status ==='pending') return <Chip color="warning" variant="outlined" label="대기중"></Chip>
  else return <Chip color="error" variant="outlined" label="거절함"></Chip>
}
export const ViewDepositRequest = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  
  const [dialog,setDialog] = useState<{
    id:number|null,
    status: DepositHistoryStatus
  }>({
    id: null,
    status: 'success'
  }) 

  return (
    <Stack direction={"column"}>
      <BreadCrumbs items={[{name:"회원관리"},{name:"입금요청"}]} />
      {!!dialog.id  && <UpdateDepositDialog id={dialog.id} status={dialog.status} onClose={()=>setDialog({id:null,status:'success'})}/>}
      <List 
        filterDefaultValues={{
          start_date: new Date(),
          end_date: new Date()
        }}
        filters={[
          <TextInput key={1} label="Search" source="q" placeholder='이름,닉네임 검색' alwaysOn/>,
          <DateInput key={2} label="시작날짜" source="start_date" placeholder="시작날짜" alwaysOn  />,
          <DateInput key={3} label="종료날짜" source="end_date" placeholder="종료날짜" alwaysOn />,
          <RadioButtonGroupInput key={4} label="상태" choices={[
            {id: 'pending', name:"대기중"},
            {id: "success", name:"완료됨"},
            {id: 'fail', name: '거절'}
          ]} optionValue="id"  source="status"/>
        ]}
        actions={<TopToolbar>
          <FilterButton disableSaveQuery />

        </TopToolbar>}
        
        sort={{ field: "id", order: "DESC" }}
        
        datagridProps={{
          bulkActionButtons:false,
          size:"medium"
        }}
      >
        <TextField label={t('ID')}  source="id" />
        <TextField label={t('Name')} source="name" sortable={false} />
        <TextField  label={t('Nick_Name')} source="nick_name" sortable={false} />
        <NumberField sx={{minWidth:120}} label={"금액"} sortable={false} source="deposit_amount" />
        
        <FunctionField label="은행정보" render={(record:any)=><Stack width={250} spacing={0.5}>
          <Stack direction={'row'}  justifyContent={"space-between"}>
            <Typography sx={{border:'1px solid'}} p={0.5}>
              은행명
            </Typography>
            <Typography>
              {record.bank_name}
            </Typography>
          </Stack>
          <Stack direction={'row'}  justifyContent={"space-between"}>
            <Typography sx={{border:'1px solid'}} p={0.5}>
              소유자
            </Typography>
            <Typography >
              {record.acc_name}
            </Typography>
          </Stack>
          <Stack direction={'row'} justifyContent={"space-between"}>
            <Typography sx={{border:'1px solid'}} p={0.5}>
              계좌번호
            </Typography>
            <Typography>
              {record.acc_num}
            </Typography>
          </Stack>
          
        </Stack>}>

        </FunctionField>
        
        <FunctionField textAlign="right" label="요청일" render={()=><Stack alignItems={"end"} spacing={0.5}>
          <DateField  source="created_at"  />
          <DateField  source="created_at" showTime showDate={false}/>
        </Stack>}/>
        <FunctionField textAlign="right" label="처리일" render={()=><Stack alignItems={"end"} spacing={0.5}>
          <DateField  source="processed_at"  />
          <DateField  source="processed_at" showTime showDate={false}/>
        </Stack>}/>
        <FunctionField textAlign="right" label="상태" render={(record:any)=><StatusChip status={record.status}/>}/>

        <FunctionField textAlign="right"  label="비고" render={(record:any)=>{
          return record.status === 'pending' ? 
            <Stack width={130} alignItems={"end"} spacing={0.5}>
              <ButtonGroup>
                <Button size="small" color="error" onClick={()=>setDialog({id:record.id,status:'fail'})}>거절</Button>
                <Button size="small" color="success" onClick={()=>setDialog({id:record.id,status:'success'})}>승인</Button>
              </ButtonGroup>
              <a href={`/${router.locale}/admin#/compose?nick_name=${record.nick_name}`}>
                <Button size="small" variant="outlined">
                  {t('Send_Message')}
                </Button>
              </a>
            </Stack>
            :<></>
        }} >

        </FunctionField>
      </List>
    </Stack>
  );
};
