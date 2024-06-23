import { Dialog as MuiDialog,Container, DialogTitle, DialogContent, LinearProgress,DialogProps as MuiDialogProps, ContainerProps  } from "@mui/material"
import React, { useMemo } from "react";


export type DialogProps = {
  open: boolean;
  onClose: (b: boolean) => unknown,
  title?: string,
  isLoading?: boolean,
  children?: React.JSX.Element,
  contentProps?: ContainerProps,
  dialogAction?: React.ReactNode
} & MuiDialogProps


export const Dialog = ({onClose,open,title,isLoading:Loading,children,contentProps,dialogAction,...props}:DialogProps) => {

  const isLoading = useMemo(()=> {
    return (typeof Loading === 'boolean' && Loading) 
      ? true
      : false;
  },[Loading])
  return open 
    ? <MuiDialog open={open} onClose={()=>onClose(false)} {...props}>
      {title 
        ? <DialogTitle>
          {title}
        </DialogTitle>
        : <></>}
      {isLoading ? <LinearProgress color="success"/>: <></>}
      <DialogContent>
        <Container maxWidth='sm' sx={{minWidth:500,minHeight:500,...(contentProps?.sx ?? {})}} {...contentProps}>
          {isLoading ? <></>:children}
        </Container>
      </DialogContent>
      {
        dialogAction
      }
    </MuiDialog>
    : <></>
}