
import { Dialog, DialogProps } from "../components/Dialog"
import { Stack, Stepper, Tabs, Typography,Tab, Box } from "@mui/material";
import { SaveButton, SelectInput, TextInput, Form, NumberInput, useCreate, useNotify, HttpError, useGetOne, useUpdate } from 'react-admin';
import React, { useState } from "react";
import { default as axios} from 'axios'
import { UpdateUserForm} from "./UpdateUserForm"
import { UpdateBankForm } from "./UpdateBankForm";

export type UserInfoDialogProps =  {
  id: number,
  onClose: () => unknown
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Stack p={3} flexGrow={1}>
          {children}
        </Stack>
      )}
    </div>
  );
}

export const UserInfoDialog = ({ id,onClose }:UserInfoDialogProps) => {
  const [open, setOpen] = useState(true)
  const [value, setValue] = React.useState(0);
  const [update,data ] = useUpdate()
  const handleChange = (e:React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  }
  const notify = useNotify();
  const getUser = useGetOne('users',{id},{
    enabled: !!id
  })

  // console.log(getUser.data);
  if(!id) return <></>;
  return (
    <Dialog open={open} isLoading={getUser.isLoading} onClose={()=>{
      setOpen(false)
      onClose();
    }} title="사용자 업데이트">
      <>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="기본 정보"/>
          <Tab label="은행정보" />
          {/* <Tab label={""}/> */}
        </Tabs>
        <CustomTabPanel value={value} index={0}>
          {getUser.data 
            ? <UpdateUserForm user={getUser.data} onSubmit={async (data)=>{
              await update('users',{
                id,
                data
              },{
                onSuccess: () =>{ 
                  notify('사용자 업데이트 완료',{
                    type:'success'
                  });
                  getUser.refetch();
                },
                onError: (err:any) => {
                  notify(err.message?.message ?? err?.message,{
                    type:'error'
                  })
                }
              })
            }}/>
            :<></>}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {getUser.data
             ? <UpdateBankForm user={getUser.data} />
            :<></>
          }
        </CustomTabPanel>
     
      </>
    </Dialog>
  )
}



