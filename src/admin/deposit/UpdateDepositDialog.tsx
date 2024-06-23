import { Dialog, DialogProps } from "../components/Dialog"
import { Alert, DialogActions, DialogContentText, Stack, Stepper, Typography, Button as MuiButton } from "@mui/material";
import { SaveButton, SelectInput, TextInput, Form, NumberInput, useCreate, useNotify, HttpError, BooleanInput, RadioButtonGroupInput, useGetOne, useUpdate, Button } from 'react-admin';
import { useMemo, useState } from "react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { zodReactAdminValidate } from "../../../utils/zodReactAdminValidate";
import { DepositHistory, DepositHistoryStatus } from "../../../entities/deposit_history";
import BigNumber from "bignumber.js";
import { UpdateDepositHistoryBodyZ } from "../../../dto/AdminDepositHistoryDto";

export type UpdateDepositDialogProps = {
  id: number,
  status: DepositHistoryStatus,
  onClose: () => unknown
}


export const UpdateDepositDialog = ({ id,status,onClose }:UpdateDepositDialogProps) => {
  // const { data,isLoading }  = useGetOne<CustomerServiceEntity>('/customer-services',{id});
  // const {mutate:answer,isLoading:answerLoading } = useAnswerCustomerSerivce() 
  const notify = useNotify();
  const depositHistory = useGetOne<DepositHistory>('deposit-histories',{
    id
  })

  const afterAmount =  useMemo(()=>{
    return new BigNumber(depositHistory.data?.balace ?? 0).plus(depositHistory.data?.deposit_amount ?? 0)
  },[depositHistory.data])
  const [update,{data,isLoading,error}] = useUpdate('deposit-histories/:id')


  const updateDepositHistory = (data:any) => {
  
    update('deposit-histories',{
      id,
      data: {
        status,
        deposit_point: status ==='success' ? data.deposit_point: depositHistory.data?.deposit_point
      }
    },{
      onError: (error:any) => {
        notify(error.message?.message ?? error.message,{
          type:'error'
        })
      },
      onSuccess: () =>{
        notify(status === 'success' ? '승인 완료':'거절 완료',{
          type:'success'
        })
        onClose();
      }
    })
  }
  
  return (
    <Dialog 
    open={!!id} 
    onClose={onClose}
    title={status ==='success' ? '승인':'거절'}
    isLoading={depositHistory.isLoading}
    contentProps={{sx:{
      minHeight:0
    }}}

    dialogAction={
      status === 'fail' &&<DialogActions>
        <Button type="button"  onClick={onClose} label="취소"/>
        <Button type="submit" color="error" onClick={updateDepositHistory} label="확인"/>
      </DialogActions>
    }
    >
      <>
        <Form onSubmit={updateDepositHistory} validate={zodReactAdminValidate(UpdateDepositHistoryBodyZ)}>
          <TextInput hidden source="status" defaultValue={status}/>
          {status === 'success' 
          ? <>
          <Grid2 container spacing={1}>
              <Grid2 xs={12}>
                <TextInput fullWidth disabled variant="outlined" label='입금전 금액' source="prev_balance" defaultValue={depositHistory.data?.balace ?? 0} required/> 
              </Grid2>
              <Grid2 xs={12}>
                <TextInput fullWidth disabled variant="outlined" label='입금액' source="cur_baance" defaultValue={depositHistory.data?.deposit_amount ?? 0} required/> 
              </Grid2>
              <Grid2 xs={12}>
                <TextInput fullWidth disabled variant="outlined" label='입금후 금액' source="after_balance" defaultValue={afterAmount} required/> 
              </Grid2>
              <Grid2 xs={12} >
                <TextInput fullWidth variant="outlined" label="추가 포인트" source="deposit_point" defaultValue={depositHistory.data?.deposit_point} required/> 
              </Grid2>
            </Grid2>
            <SaveButton label={"저장"} />
          </>
          : <Grid2 container spacing={1}>
              <DialogContentText id="alert-dialog-description">
                거절 하시겠습니까?
              </DialogContentText>
             
            </Grid2>
           }
        </Form>
      </>
    </Dialog>
  )
}
