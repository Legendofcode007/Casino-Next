import { Admin, Resource, fetchUtils, CustomRoutes } from "react-admin";
import { ViewBettingHistory} from "./betting/viewBettingHistory";
import { Sent } from './sent/Sent';
import { Compose } from './compose/Compose';
import { ViewNotice } from "./notice/ViewNotice";
import { CreateNotice } from "./notice/createNotice";
import { NoticeDetails } from './notice/details/[id]';
import { darkTheme,lightTheme } from './themes';
import { ViewDepositRequest } from "./deposit/viewDepositRequest";
import { ViewResellersCompensation } from "./compensation/viewResellersCompensation";
import { CompensationDetails } from './compensation/details/[id]';
import { ViewWithdrawRequest } from "./withdraw/viewWithdrawRequest";


import { Route,Routes } from "react-router-dom";
import { default as polyglot } from 'ra-i18n-polyglot'
import { ko } from "./ra-ko"
import { dataProvider } from "./dataProvider"
import AdminLayout from "./AdminLayout";
import React from "react";



const ViewUsers = React.lazy(()=>  import('./users/viewUsers'))
const ViewNotices = React.lazy(()=> import('./notice/ViewNotice'))
const ViewCustomerServices = React.lazy(()=> import('./customer-services/index'))
const ViewInboxes = React.lazy(()=>import('./inboxes'))
const ViewResellers = React.lazy(()=>import('./resellers'))

const App = (props:any) => {
  return (
    (props.props.user.role == 'super_admin' || props.props.user.role == 'admin')  ? <Admin 
      layout={AdminLayout} 
      dataProvider={dataProvider}
      lightTheme={lightTheme}
      theme={lightTheme}
      defaultTheme="light"
      i18nProvider={polyglot(()=>ko as any,'ko')}
    >
      
      <Resource name="notice-boards" list={ViewNotices} create={CreateNotice} />

      <Resource name="users" list={ViewUsers} />
      <Resource name="customer-services" list={ViewCustomerServices} />

      <Resource name="resellers" list={ViewResellers} />

      <Resource name="deposit-histories" list={ViewDepositRequest} />
      <Resource name="withdraw-histories" list={ViewWithdrawRequest} />
      
      <Resource name="inboxes" list={ViewInboxes} />

      <Resource name="/view-betting-history" list={ViewBettingHistory} />
      <Resource name="/view-resellers-compensation" list={ViewResellersCompensation} />

  
      <CustomRoutes>

        <Route path="/view-compensation-details/:id" element={<CompensationDetails props={props.props.user} />} />
          
        <Route path="/sent" element={<Sent props={props.props.user} />} />

        <Route path="/compose" element={<Compose props={props.props.user} />} />
          
        <Route path="/view-notice-details/:id" element={<NoticeDetails />} />
    
          
      
      </CustomRoutes>
      
    </Admin>
      :<></>
  );
}

export default App;
