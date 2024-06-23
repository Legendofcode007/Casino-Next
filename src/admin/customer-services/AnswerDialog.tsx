import { Dialog, DialogProps } from "../components/Dialog"
import { Stack, Stepper, Typography } from "@mui/material";
import { SaveButton, SelectInput, TextInput, Form, NumberInput, useCreate, useNotify, HttpError, BooleanInput, RadioButtonGroupInput, useGetOne } from 'react-admin';
import { TextField } from '@mui/material'
import useTranslation from 'next-translate/useTranslation';
import { useState } from "react";
import { UserRole } from "../../../entities/user";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { zodReactAdminValidate } from "../../../utils/zodReactAdminValidate";
import { CustomerServiceEntity } from "../../../entities/customer_services";
import { useAnswerCustomerSerivce } from "../hooks/useAnswerCustomerService"
import { AnswerCustomerServiceBodyDtoZ } from "../../../dto/AdminCustomerServiceDto";

export type AnwerDialogDialogProps = {
  id: number,
  onClose: () => unknown
}


export const AnwerDialogDialog = ({ id,onClose }:AnwerDialogDialogProps) => {
  const { data,isLoading }  = useGetOne<CustomerServiceEntity>('/customer-services',{id});
  const {mutate:answer,isLoading:answerLoading } = useAnswerCustomerSerivce() 
  const notify = useNotify();

  const postSave = async (data:any) => {
    console.log('call')
    answer({
      id,
      answer_description:data.answer_description
    },{
      onSuccess: () => {
        notify("답변 완료", {
          type:'success'
        })
        onClose();
      },
      onError: (err:any) => {
        notify(err?.message ?? err?.message?.message,{
          autoHideDuration: 2000,
          type:'error'
        })
      }
    })
  };
  return (
    <Dialog open={!!id} onClose={onClose} title="답변하기" isLoading={isLoading || answerLoading}>
      <>
        <Form  onSubmit={postSave} validate={zodReactAdminValidate(AnswerCustomerServiceBodyDtoZ)}>
          <Grid2 container spacing={1}>
            <Grid2 xs={12}>
              <TextInput fullWidth disabled variant="outlined" label='제목' source="title" defaultValue={data?.title} required/> 
            </Grid2>
            <Grid2 xs={12} >
              <TextInput multiline rows={10} disabled fullWidth variant="outlined" label="내용" source="desciption" defaultValue={data?.description} required/> 
            </Grid2>
            <Grid2 xs={12}>
              <TextInput multiline    rows={20} fullWidth variant="outlined" label='답변' source="answer_description" defaultValue={data?.answer_description}  required/> 
            </Grid2>

          </Grid2>
          <SaveButton  label={"답변"} />
        </Form>
      </>
    </Dialog>
  )
}
