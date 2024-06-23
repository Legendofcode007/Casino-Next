import { Dialog, DialogProps } from "../components/Dialog"
import { Stack, Stepper, Typography,CircularProgress, Button } from "@mui/material";
import { SaveButton, SelectInput, TextInput, Form, NumberInput, useCreate, useNotify, HttpError, RadioButtonGroupInput, BooleanInput, useGetOne } from 'react-admin';
import { TextField } from '@mui/material'
import useTranslation from 'next-translate/useTranslation';
import { useState } from "react";
import { User, UserRole, UserRolez } from "../../../entities/user";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { UpdateUserBodyZ } from "../../../dto/AdminUserDto";
import { zodReactAdminValidate } from "../../../utils/zodReactAdminValidate";
import { Rate } from "../../../entities/rate";



export type UpdateUserFormProps = {
    user: User,
    onSubmit: (data:any)=>Promise<unknown>
}
export const UpdateUserForm = ({user,onSubmit}:UpdateUserFormProps) => { 
  const {data,isLoading,refetch} = useGetOne<Rate>('/rates',{
    id: user.id,
  })
  const notify = useNotify();

  return <Form onSubmit={async (data)=>{
    await onSubmit(data)
    refetch();
  }} validate={zodReactAdminValidate(UpdateUserBodyZ)}>
    <Grid2 container spacing={1}>
      <Grid2 xs={12} md={6}>
        <TextField disabled fullWidth variant="outlined" label="야이디" value={user.id}></TextField>
      </Grid2>
      <Grid2 xs={12} md={6}>
        <TextInput fullWidth variant="outlined" label='이름' source="name"  defaultValue={user.name} required/> 
      </Grid2>
      <Grid2 xs={12} md={6}>
        <TextField disabled fullWidth variant="outlined" label="닉네임" value={user.nick_name}></TextField>
      </Grid2>
      <Grid2 xs={12}>
        <TextField disabled fullWidth variant="outlined" label="이메일" value={user.email}></TextField>
      </Grid2>
      <Grid2 xs={12}>
        <TextInput fullWidth variant="outlined" label="비밀번호" source="password"  type="password"/> 
      </Grid2>

      <Grid2 xs={12} md={6}>
        <NumberInput fullWidth variant="outlined" source="balance" defaultValue={user.balance} /> 
      </Grid2>
      <Grid2 xs={12} md={6}>
        <NumberInput fullWidth variant="outlined" source="point" label="포인트" defaultValue={user.point} /> 
      </Grid2>     
      <Grid2 xs={12} >
        <TextInput fullWidth variant="outlined" source="phone" defaultValue={user.phone} /> 
        <BooleanInput 
          fullWidth 
          variant="outlined" 
          source="phone_verified" 
          label="핸드폰 인증여부" 
          defaultValue={!!user.phone_verified}
         /> 
      </Grid2>    
      <Grid2 xs={12} md={4}>
        <TextInput fullWidth variant="outlined" source="betting_limit" defaultValue={user.betting_limit}  /> 
      </Grid2>
      <Grid2 xs={12} md={4}>
        <TextInput fullWidth variant="outlined" source="winning_limit" defaultValue={user.winning_limit} /> 
      </Grid2>

      <Grid2 xs={12}>
        <TextField disabled variant="outlined" fullWidth label='권한' value={user.role}/>
      </Grid2>
      {user.role === 'reseller' ? 
        <>
          <Grid2 xs={12} sx={{py:2}} >
            <Grid2 container border={1} borderRadius={4} spacing={2}>
              <Typography component={Grid2} textAlign={"center"} variant="h6" xs={12}>
                총판 설정
              </Typography>
              {isLoading 
                ?  <CircularProgress color="success"/>
                : <>
                  <Grid2 xs={12} md={6} >
                    <TextInput fullWidth variant="outlined" label='casino_ggr' source="casino_ggr" defaultValue={data?.casino_ggr}/>
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <TextInput fullWidth variant="outlined" label='slot_ggr' source="slot_ggr" defaultValue={data?.slot_ggr}/>
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <TextInput fullWidth variant="outlined" label='casino_rolling' source="casino_rolling" defaultValue={data?.casino_rolling}/>
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <TextInput fullWidth variant="outlined" label='slot_rolling' source="slot_rolling" defaultValue={data?.slot_rolling} />
                  </Grid2>
                </>
                }
              
            </Grid2>
          </Grid2>
          <Grid2 xs={12} sx={{py:2}}  >
            <Stack direction={"row"} alignItems={'center'} gap={1}>
              <TextField disabled  variant="outlined" label="추천인코드" value={user.referral_code}></TextField>
              <Button variant="outlined" type="button" onClick={async ()=> {
                await navigator.clipboard.writeText(user.referral_code ?? '');
                notify('복사 되었습니다.')
              }}>복사</Button>
              <Button variant="outlined" type="button" onClick={async ()=> {
                const location = window.location;
                const url = `${location.protocol}//${location.hostname}:${location.port}`
                await navigator.clipboard.writeText(`${url}/signup?ref=${user.referral_code}`);
                notify('복사 되었습니다.')
              }}>회원가입 링크 복사</Button>
            </Stack>
          </Grid2>
        </>
        : <></>
      }
      {user.role ==='user'
        ? <Grid2 xs={12} sx={{py:2}} >
          <Grid2 container border={1} borderRadius={4} spacing={2}>
            <Typography component={Grid2} textAlign={"center"} variant="h6" xs={12}>
                    유저 설정
            </Typography>
            <Grid2 xs={12} md={6} >
              <TextInput fullWidth variant="outlined" label='총판ID' source="reseller_id"  defaultValue={user?.permission_info?.controller_id}/>
            </Grid2>
          </Grid2>
        </Grid2>
        : <></>
      }

      <Grid2 xs={12}>
        <BooleanInput source="approved"
          defaultValue={!!user.approved}

          helperText="승인시에 실제 알본사에 계정을 만듭니다." 
        />
               
      </Grid2>
    </Grid2>
        
    <SaveButton label={"저장"} />
  </Form>
}