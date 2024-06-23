import {
  TextField,
  FunctionField,
  TextInput,
  RadioButtonGroupInput,
  TopToolbar,
  FilterButton,
  DateField,
  DateInput
} from "react-admin";
import { Button, ButtonGroup, Chip, Grid, Stack, Typography } from "@mui/material";
import useTranslation from 'next-translate/useTranslation';
import { BreadCrumbs } from "../components/BreadCrumbs";
import { List } from "../components/DataGrid";
import { CustomerServiceStatus } from "../../../entities/customer_services";
import { InboxStatus } from "../../../entities/inbox";


type StatusChipProps = {
  status: InboxStatus
}
const StatusChip = ({status}:StatusChipProps) => {
  if(status === 'read') return <Chip color="success" variant="outlined" label="읽음"></Chip>
  else if (status === 'unread') return <Chip color="warning" variant="outlined" label="읽지않음"></Chip>
  else return <Chip color="info" variant="outlined" label="삭제됨"></Chip>
}

export const Inboxes = (props:any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation('common');

  return <Stack direction={"column"}>
  <BreadCrumbs items={[{name:"고객센터"},{name:"문의목록"}]} />
  <List 
    filters={[
      <TextInput key={1} label="Search" source="q" placeholder='이름,닉네임 검색' alwaysOn/>,
      <DateInput key={2} label="시작날짜" source="start_date" placeholder="시작날짜" alwaysOn  />,
      <DateInput key={3} label="종료날짜" source="end_date" placeholder="종료날짜" alwaysOn />,
      <RadioButtonGroupInput key={4} label="상태" choices={[
        {id: 'read', name: '읽음'},
        {id: 'unread', name: '읽지않음'},
        {id: 'deleted', name: '삭제됨'},
      ]} optionValue="id"  source="status"/>
    ]}
    actions={<TopToolbar>
      <FilterButton disableSaveQuery />

    </TopToolbar>}
    
    sort={{ field: "created_at", order: "DESC" }}
    
    datagridProps={{
      bulkActionButtons:false,
      size:"medium"
    }}
  >
    <TextField label={t('ID')}  source="id" />
    <TextField label={t('Name')} source="name" sortable={false} />
    <TextField  label={t('Nick_Name')} source="nick_name" sortable={false} />

    <TextField  label="제목" source="subject" sortable={false} />

    <FunctionField textAlign="right" label="보낸날짜" render={()=><Stack alignItems={"end"} spacing={0.5}>
      <DateField  source="created_at"  />
      <DateField  source="created_at" showTime showDate={false}/>
    </Stack>}/>
    <FunctionField textAlign="right" label="읽은날짜" render={()=><Stack alignItems={"end"} spacing={0.5}>
      <DateField  source="processed_at"  />
      <DateField  source="processed_at" showTime showDate={false}/>
    </Stack>}/>
    <FunctionField textAlign="right" label="상태" render={(record:any)=><StatusChip status={record.status}/>}/>

    {/* <FunctionField textAlign="right"  label="비고" render={(record:any)=>{
      return record.status === 'pending' ? 
        <Stack width={130} alignItems={"end"} spacing={0.5}>
          <Button size="small" variant="outlined" color="success">답변</Button>
        </Stack>
        :<></>
    }} >

    </FunctionField> */}

  </List>
</Stack>;
};


export default Inboxes;