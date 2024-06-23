import List from "@mui/material/List";
import ListItemButton, { ListItemButtonTypeMap } from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
//import StarBorder from "@mui/icons-material/StarBorder";
import useTranslation from 'next-translate/useTranslation';
import Divider from '@mui/material/Divider';
//import LabelIcon from '@mui/icons-material/Label';
import DashboardIcon from '@mui/icons-material/Dashboard';
//import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import CreateIcon from '@mui/icons-material/Create';
import GridOnIcon from '@mui/icons-material/GridOn';
import PersonIcon from '@mui/icons-material/Person'
import MailIcon from '@mui/icons-material/Mail'
import InputIcon from '@mui/icons-material/Input';
import { Drawer, ExtendButtonBase, Input, ListItem, styled, useTheme } from "@mui/material";
import { useGetDashboard } from "./hooks/useGetDashboard";
import { BorderBottom, BorderTop, Output } from "@mui/icons-material";

const MenuList = styled(List)(({theme})=>({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.getContrastText(theme.palette.primary.main)
}))

type MenuItemProps = {
  icon?: React.ReactElement,
  label: string;
  header?:boolean,
  link?: string;
}
export const MenuItem = (props:MenuItemProps) => {
  const theme = useTheme();
  return props.header ? 
  <>
    <List sx={{backgroundColor:theme.palette.primary.main,color:theme.palette.primary.contrastText}} disablePadding>
      <ListItem >
        {props.icon && <ListItemIcon>
          {props.icon}
        </ListItemIcon>}
        <ListItemText primary={props.label}/>
      </ListItem>
    </List>
    <Divider/>
  </>
  :<>
  <List sx={{ 
    backgroundColor:theme.palette.third.main,
    color:theme.palette.third.contrastText,
  }} disablePadding>
    <ListItemButton 
      href={props.link ?? '#'}
    >
      <ListItemIcon>
        {props.icon}
        
      </ListItemIcon>
      <ListItemText primary={props.label}/>
    </ListItemButton>
  </List>
  <Divider/>
  </>
} 


export const AdminMenu = () => {
  const { t } = useTranslation('common');

  const { data, isLoading } = useGetDashboard();
  return (
    <>
      <List
          sx={{  width: '100%', bgcolor: 'primary',padding:0 }}
          component="nav"
          aria-labelledby="nested-list-subheader">
        <Divider />

        <MenuItem label="회원관리" header/>
        <MenuItem label={'회원목록'} icon={<PersonIcon />} link="#/users"/>
        <MenuItem label={t('Deposit_Request')} icon={<InputIcon />} link="#/deposit-histories"/>
        <MenuItem label={t('Withdraw_Request')} icon={<Output />} link="#/withdraw-histories"/>
        <MenuItem label={'배팅기록'} icon={<Output />} link="#/view-betting-history"/>

        <MenuItem label="총판" header/>
        <MenuItem label={'총판 목록'} icon={<PersonIcon />} link="#/resellers"/>

        <MenuItem label="쪽지" header/>
        <MenuItem label={`보낸쪽지`} icon={<MailIcon />} link="#/inboxes"/>
        <MenuItem label={'쪽지 보내기'} icon={<CreateIcon />} link="#/compose"/>

        <MenuItem label="고객센터" header/>
        <MenuItem label={`문의 목록(${data?.unreadCount ?? 0})`} icon={<MailIcon />} link="#/customer-services"/>

        <MenuItem label="공지사항" header/>
        <MenuItem label={t('View_Notices')} icon={<GridOnIcon/>} link="#/notice-boards"/>
        

        {/* <List sx={{color:"#fff", backgroundColor:"#999"}} component="div" disablePadding>
          <ListItemButton sx={{ pl: 1 }} >
            <ListItemText primary={"배팅"} />
          </ListItemButton>
        </List>


        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 1 }} href="#/view-betting-history?displayedFilters={}&filter={}&order=DESC&page=1&perPage=10&sort=id">
            <ListItemIcon>
              <GridOnIcon />
            </ListItemIcon>
            <ListItemText primary={t('Betting_History')} />
          </ListItemButton>
        </List>
        <Divider />


        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 1 }} href="#/view-resellers-compensation?displayedFilters={}&filter={}&order=DESC&page=1&perPage=10&sort=id">
            <ListItemIcon>
              <GridOnIcon />
            </ListItemIcon>
            <ListItemText primary={t('Compensation')} />
          </ListItemButton>
        </List>
         */}
        
        
      </List >
    </>
  );
};
