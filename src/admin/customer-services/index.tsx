import {
  TextField,
  FunctionField,
  TextInput,
  RadioButtonGroupInput,
  TopToolbar,
  FilterButton,
  DateField,
  useRefresh,
  DateInput
} from "react-admin";
import { Button, ButtonGroup, Chip, Grid, Stack, Typography } from "@mui/material";
import useTranslation from 'next-translate/useTranslation';
import { BreadCrumbs } from "../components/BreadCrumbs";
import { List } from "../components/DataGrid";
import { CustomerServiceStatus } from "../../../entities/customer_services";
import { useState } from "react";
import { AnwerDialogDialog } from "./AnswerDialog"

type StatusChipProps = {
  status: CustomerServiceStatus
}
const StatusChip = ({status}:StatusChipProps) => {
  if(status === 'pending') return <Chip color="warning" variant="outlined" label="답변대기"></Chip>
  else return <Chip color="success" variant="outlined" label="답변완료"></Chip>
}

export const ViewCustomerServices = (props:any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation('common');
  const [id,setId] = useState<number|null>(null)
  const refresh = useRefresh()
  return <Stack direction={"column"}>
  <BreadCrumbs items={[{name:"고객센터"},{name:"문의목록"}]} />
  {!!id && <AnwerDialogDialog id={id} onClose={()=>{
    setId(null)
    refresh();
  }} /> }
  <List 
    filters={[
      <TextInput key={1} label="Search" source="q" placeholder='이름,닉네임 검색' alwaysOn/>,
      <DateInput key={2} label="시작날짜" source="start_date" placeholder="시작날짜" alwaysOn />,
      <DateInput key={3} label="종료날짜" source="end_date" placeholder="종료날짜" alwaysOn />,
      <RadioButtonGroupInput key={4} label="상태" choices={[
        {id: 'pending', name: '답변대기'},
        {id: 'success', name: '답변완료'},
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

    <TextField  label="제목" source="title" sortable={false} />

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
      return  <Stack width={130} alignItems={"end"} spacing={0.5}>
          <Button 
          size="small" 
          variant="outlined" 
          color={record.status === 'pending' ? 'warning':'success'} 
          onClick={()=>setId(record.id)}>
            {record.status === 'pending' ? '답변':'수정'}
          </Button>
        </Stack>
       
    }}>

    </FunctionField>

  </List>
</Stack>;
};


export default ViewCustomerServices;