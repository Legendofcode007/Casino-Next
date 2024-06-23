import {
  Datagrid,
  TextField,
  FunctionField,
  Form,
  SaveButton,
  TextInput,
  SelectInput,
  Button,
  SimpleShowLayout,
  NumberField,
  DateInput,
  RadioButtonGroupInput,
  TopToolbar,
  FilterButton,
  DateField
} from "react-admin";
import { ButtonGroup, Chip, Grid, Stack, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from "next/router";
import { useRecordContext } from 'react-admin';
import { BreadCrumbs } from "../components/BreadCrumbs";
import { List } from "../components/DataGrid";
import { BettingResult } from "../../../entities/betting_history";


type ResultChipProps = {
  reulst: BettingResult
}
const ResultChip = ({reulst}:ResultChipProps) => {
  if(reulst === 'bet') return <Chip color="info" variant="outlined" label="배팅"></Chip>
  else if(reulst ==='won') return <Chip color="success" variant="outlined" label="승리"></Chip>
  else if(reulst ==='cancelled') return <Chip color="warning" variant="outlined" label="취소됨"></Chip>
  else if(reulst ==='lost') return <Chip color="error" variant="outlined" label="패배"></Chip>
  else return <></>
}


export const ViewBettingHistory = (props:any) => {
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation('common');

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const search = useLocation().search;

  return <Stack direction={"column"}>
  <BreadCrumbs items={[{name:"회원관리"},{name:"배팅기록"}]} />
  <List 
    filterDefaultValues={{
      start_date: new Date(),
      end_date: new Date()
    }}
    filters={[
      <TextInput key={1} label="Search" source="q" placeholder='이름,닉네임 검색' alwaysOn/>,
      <DateInput key={2} label="시작날짜" source="start_date" placeholder="시작날짜" alwaysOn  />,
      <DateInput key={3} label="종료날짜" source="end_date" placeholder="종료날짜" alwaysOn />,
      <RadioButtonGroupInput key={4} label="결과" choices={[
        {id: 'bet', name: '배팅'},
        {id: 'won', name:"승리"},
        {id: "lost", name:"패배"},
        {id: 'cancelled', name: '취소'},
      ]} optionValue="id"  source="result"/>
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

    <FunctionField textAlign="right" label="게임종류" render={(record:any)=><Typography>{record.game_type === 'live' ? '카지노':'슬롯'}</Typography>}/>
    <NumberField sx={{minWidth:120}} label={"금액"} sortable={false} source="amount" />
    
    <FunctionField textAlign="right" label="결과" render={(record:any)=><ResultChip reulst={record.result}/>}/>

    <FunctionField textAlign="right" label="생싱일" render={()=><Stack alignItems={"end"} spacing={0.5}>
      <DateField  source="date"  />
      <DateField  source="date" showTime showDate={false}/>
    </Stack>}/>

  </List>
</Stack>;
};
