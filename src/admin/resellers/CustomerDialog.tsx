import { Dialog, DialogProps } from "../components/Dialog"
import { SaveButton, SelectInput, TextInput, Form, NumberInput, useCreate, useNotify, HttpError, BooleanInput, RadioButtonGroupInput, useGetOne, useGetList, TextField, NumberField, FunctionField, TopToolbar, DateInput, ListContextProvider, useList, useListController, Pagination, useListContext } from 'react-admin';
import useTranslation from 'next-translate/useTranslation';
import { useState } from "react";
import { User, UserRole } from "../../../entities/user";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { zodReactAdminValidate } from "../../../utils/zodReactAdminValidate";
import { CustomerServiceEntity } from "../../../entities/customer_services";
import { CustomDataGrid, List } from "../components/DataGrid";
import { SimpleTable } from "../components/SimpleTable";
import BigNumber from "bignumber.js";
import { BooleanIcon } from "../components/BooleanIcon";
import { BannChip } from "../users/viewUsers";


export type CustomerDialogProps = {
  id: number,
  onClose: () => unknown,
  start_date?: string,
  end_date?: string
}

export const CustomerDialog = ({ id,onClose }:CustomerDialogProps) => {
  const { t } = useTranslation('common');


  const {data,isLoading } = useGetList('/users',{
    filter: {
      resller_id:id
    },
    pagination:{
      page: 1,
      perPage: 10
    },
    sort: {
      field:'id',
      order: 'DESC'
    }
  })

 
  const listContext = useList({
    data,
    isLoading,
    perPage:10
  })

  return (
    <Dialog 
      open={!!id} 
      onClose={onClose} 
      title="고객목록" 
      isLoading={isLoading}
    >
      <ListContextProvider value={listContext}>
        <CustomDataGrid
          bulkActionButtons={false}
          cellWidth={80}
        >
          <TextField label={t('ID')}  source="id" />
          <TextField label={t('Name')} source="name" />
          <TextField  label={t('Nick_Name')} source="nick_name" />

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
        </CustomDataGrid>
        <Pagination rowsPerPageOptions={[5,10, 25, 50]} defaultValue={1} />
      </ListContextProvider>
    </Dialog>
  )
}
