import { Dialog, DialogProps } from "../components/Dialog"
import { Stack, Stepper, Typography } from "@mui/material";
import { SaveButton, SelectInput, TextInput, Form, NumberInput, useCreate, useNotify, HttpError, BooleanInput, RadioButtonGroupInput } from 'react-admin';
import { TextField } from '@mui/material'
import useTranslation from 'next-translate/useTranslation';
import { useState } from "react";
import { UserRole } from "../../../entities/user";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { zodReactAdminValidate } from "../../../utils/zodReactAdminValidate";
import { CreaeteUserBodyDtoZ } from "../../../dto/AdminUserDto";

export type CreateUserDialogProps = DialogProps & {

}

export const CreateUserDialog = ({ onClose, open }:CreateUserDialogProps) => {
  const [role,setRole] = useState<UserRole>('user');
  const [createUser,{data,isLoading,error}] = useCreate() 
  const notify = useNotify();

  const postSave = async (data:any) => {

    createUser("users",{
      data
    },{
      onSuccess: () => {
        notify("유저 생성 완료", {
          type:'success'
        })
        onClose(false);
      },
      onError: (err:any) => {
        notify(err?.message ?? err?.message?.message,{
          autoHideDuration: 2000,
          type:'error'
        })
      }
    })
    // await axios.post('/api/admin/create-user',data);
  };
  return (
    <Dialog open={open} onClose={onClose} title="사용자 생성">
      <>
        <Form   onSubmit={postSave} validate={zodReactAdminValidate(CreaeteUserBodyDtoZ)}>
          <Grid2 container spacing={1}>
            <Grid2 xs={12} md={6}>
              <TextInput fullWidth variant="outlined" label='이름' source="name" defaultValue='' required/> 
            </Grid2>
            <Grid2 xs={12} md={6}>
              <TextInput fullWidth variant="outlined" label="닉네임" source="nick_name" defaultValue='' required/> 
            </Grid2>
            <Grid2 xs={12}>
              <TextInput fullWidth variant="outlined" label='이메일' source="email" defaultValue=''  required/> 
            </Grid2>
            <Grid2 xs={12}>
              <TextInput fullWidth variant="outlined" label="비밀번호" source="password" defaultValue='' required type="password"/> 
            </Grid2>

            <Grid2 xs={12} md={6}>
              <NumberInput fullWidth variant="outlined" source="balance"  defaultValue={0} /> 
            </Grid2>     
            <Grid2 xs={12} md={6}>
              <NumberInput fullWidth variant="outlined" source="point" label="포인트" defaultValue={0} /> 
            </Grid2>     
            <Grid2 xs={12} >
              <TextInput fullWidth variant="outlined" source="phone"  /> 
              <BooleanInput fullWidth variant="outlined" source="phone_verified" label="핸드폰 인증여부" defaultValue={0} /> 
            </Grid2>     
      

            <Grid2 xs={12} md={6}>
              <TextInput fullWidth variant="outlined" source="betting_limit" defaultValue='0'  /> 
            </Grid2>
            <Grid2 xs={12} md={6}>
              <TextInput fullWidth variant="outlined" source="winning_limit" defaultValue='0' /> 
            </Grid2>

            <Grid2 xs={12}>
              <RadioButtonGroupInput
                fullWidth  
                variant="outlined" 
                label="권한" 
                source="role" 
                choices={[
                  { id: 'user', name: '유저' },
                  { id: 'admin', name: '관리자' },
                  { id: 'reseller', name: '총판' },
                ]} required defaultValue={role} onChange={(e)=>setRole(e.target.value)}/>
            </Grid2>
            {role === 'reseller' ? 
              <Grid2 xs={12} >
                <Grid2 container border={1} borderRadius={4} spacing={2}>
                  <Typography component={Grid2} textAlign={"center"} variant="h6" xs={12}>
                    총판 설정
                  </Typography>
                  <Grid2 xs={12} md={6} >
                    <TextInput fullWidth variant="outlined" label='casino_ggr' source="casino_ggr" defaultValue='0' />
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <TextInput fullWidth variant="outlined" label='slot_ggr' source="slot_ggr" defaultValue='0'/>
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <TextInput fullWidth variant="outlined" label='casino_rolling' source="casino_rolling" defaultValue='0'/>
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <TextInput fullWidth variant="outlined" label='slot_rolling' source="slot_rolling" defaultValue='0' />
                  </Grid2>
                </Grid2>
              </Grid2>
              : <></>
            }
            {role ==='user'
              ? <Grid2 xs={12} >
                <Grid2 container border={1} borderRadius={4} spacing={2}>
                  <Typography component={Grid2} textAlign={"center"} variant="h6" xs={12}>
                  유저 설정
                  </Typography>
                  <Grid2 xs={12} md={6} >
                    <TextInput fullWidth variant="outlined" label='총판ID' source="reseller_id" />
                  </Grid2>
                </Grid2>
              </Grid2>
              : <></>
            }

            <Grid2 xs={12}>
              <BooleanInput
                fullWidth 
                variant="outlined" 
                source="approved"
                defaultValue={false}
                helperText="승인시에 실제 알본사에 계정을 만듭니다." 
              />
            </Grid2>
          </Grid2>
        
          <SaveButton label={"저장"} />
        </Form>
      </>
    </Dialog>
  )
}



