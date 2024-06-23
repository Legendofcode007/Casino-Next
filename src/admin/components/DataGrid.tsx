import { Container, Stack, styled, useMediaQuery } from "@mui/material";
import React, { ReactNode } from "react";
import { Datagrid, DatagridClasses, DatagridProps,ListProps as RaListProps,List as RaList } from "react-admin";



export const CustomDataGrid = styled(Datagrid)(({theme,cellWidth})=>({
  marginTop: "0px",
  paddingTop:"0px",
  [`& .${DatagridClasses.rowCell}`]: {
    minWidth: cellWidth ?? 120,
  },
  [`& .${DatagridClasses.headerCell}`]: {
    minWidth: cellWidth ??120,
  },

}))



export type ListProps = RaListProps & {
  datagridProps: DatagridProps,
  provider?: React.ReactElement
}
export const List = ({datagridProps,children,provider,...props}:ListProps) => {
 
  return <Stack alignItems={'center'}>
    <Container maxWidth={"lg"} sx={{m:0}}  style={{paddingLeft:0,paddingRight:0}} >
      <RaList debounce={500} {...props} >
        <Container maxWidth={"lg"} sx={{overflow:'auto',m:0}} style={{paddingLeft:0,paddingRight:0}}>
          <CustomDataGrid {...datagridProps} >
            {children}
          </CustomDataGrid>
        </Container>
      </RaList>
    </Container>
  </Stack>
}