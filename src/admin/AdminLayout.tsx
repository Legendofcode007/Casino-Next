import { Layout,LayoutClasses } from "react-admin";
import AdminAppBar from "./AdminAppBar";
import { AdminMenu } from "./AdminMenu";
import { CircularProgress, Stack, useTheme } from "@mui/material"
import { SimpleTable } from "./components/SimpleTable";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useGetDashboard } from "./hooks/useGetDashboard";
import { yellow } from "@mui/material/colors";
import BigNumber from "bignumber.js";

const AdminLayout = ({children,...props}: any) => {
  const { data, isLoading } = useGetDashboard()
  const theme = useTheme();

  return (
    <Layout {...props} appBar={AdminAppBar} menu={AdminMenu} sx={{

      [`& .${LayoutClasses.contentWithSidebar}`]: {
        width: "100vw",
        overflow:'hidden'
      },
      [`& .${LayoutClasses.content}`]: {
        flex:1,
        overflow:'auto'
      }
    }}>
      <Stack direction={"column"} flex={1} >
      <Stack  pt={2} pb={4} sx={
        (theme)=>({
          overflowX:'auto',
          px:0,
          mx:0,
          alignItems:'center',
          width:'100%',
          [theme.breakpoints.down("sm")]:{
            width:"100%",
            alignItems:"start"
          }
        })
        }>
        <SimpleTable  sx={{width:500}}>
          {!isLoading 
            ? <>
              <Grid2 xs={12}minHeight={20} textAlign={'center'} sx={{backgroundColor:theme.palette.primary.main,color:theme.palette.primary.contrastText}}>
                오늘
              </Grid2>
              <Grid2 xs={3}minHeight={20} textAlign={'center'} sx={{backgroundColor:theme.palette.primary.main,color:theme.palette.primary.contrastText}}>
                내 잔액
              </Grid2>
              <Grid2 xs={3} minHeight={20} textAlign={'center'} sx={{backgroundColor:theme.palette.primary.main,color:theme.palette.primary.contrastText}} >
                유저 배팅액
              </Grid2>
              <Grid2 xs={3} minHeight={20} textAlign={'center'} sx={{backgroundColor:theme.palette.primary.main,color:theme.palette.primary.contrastText}}>
                유저 수익
              </Grid2>
              <Grid2 xs={3} minHeight={20} textAlign={'center'} sx={{backgroundColor:theme.palette.primary.main,color:theme.palette.primary.contrastText}}>
                플랫폼 손익
              </Grid2>
              <Grid2 xs={3} minHeight={20} textAlign={"right"} sx={{backgroundColor:yellow[700],color: theme.palette.primary.contrastText}}>
                {data?.balance ?? 0}
              </Grid2>
              <Grid2 xs={3} minHeight={20} textAlign={"right"} sx={{backgroundColor:yellow[700],color:theme.palette.primary.contrastText}} >
                {data?.statistic?.bet_amount ?? 0}
              </Grid2>
              <Grid2 xs={3} minHeight={20} textAlign={"right"} sx={{backgroundColor:yellow[700],color:theme.palette.primary.contrastText}}>
                {data?.statistic?.win_amount ?? 0}
              </Grid2>
              <Grid2 xs={3} minHeight={20} textAlign={"right"} sx={{backgroundColor:yellow[700],color:theme.palette.primary.contrastText}}>
                {new BigNumber(data?.statistic?.bet_amount ?? 0).minus(data?.statistic?.win_amount ?? 0).toFixed(0)}
              </Grid2>
            </>
            :<Grid2 xs={12} container direction={"row"} alignItems={"center"} justifyContent={"center"} >
              <CircularProgress color="success"/>
            </Grid2>}
        </SimpleTable>
      </Stack>
        {children}
      </Stack>

    </Layout>
  )
}

export default AdminLayout;
