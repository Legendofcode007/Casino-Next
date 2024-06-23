import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { List, Datagrid, TextField, FunctionField, SimpleShowLayout } from 'react-admin';

import useTranslation from 'next-translate/useTranslation';

import { useRouter } from "next/router";

export const CompensationDetails = (props) => {

  const { t } = useTranslation('common');
  const { id } = useParams();
  const router = useRouter();

  const search = useLocation().search;
  let nick_name = new URLSearchParams(search).get("nick_name");
  let start = new URLSearchParams(search).get("start");
  let end=new URLSearchParams(search).get("end");

  let [startDate, setStartDate] = useState(null);
  let [endDate, setEndDate] = useState(null);

  const [nickName, setNickName] = useState(nick_name);

  useEffect(() => {

    if (start != 'null') {
      setStartDate(new Date(start).toISOString().split('T')[0]);
      start='null' 
    }
  
    if (end != 'null') {
      setEndDate(new Date(end).toISOString().split('T')[0]);
      end = 'null';
    }
   

  }, [startDate, endDate, nickName])
  
  const ResellerDetails = () => {

    return (
      <SimpleShowLayout sx={{fontSize:"20px", fontWeight:"800px", color:"#000000"}}>

        <TextField label={t('Reseller_ID')} source="id" />
        <TextField label={t('Reseller_Nick')} sortable={false} source="nick_name" />
        <TextField label={t('Reseller_Name')} source="name" />
        <TextField label={t('Member_Since')} sortable={false} source="created_at" />

      </SimpleShowLayout>
    );
  };

  const ResellerRates = () => {

    return (
      <SimpleShowLayout sx={{fontSize:"20px", fontWeight:"800px", color:"#000000"}}>

        <TextField label={t('ID')} source="id" />
        <TextField label={t('Casino_GGR')} sortable={false} source="casino_ggr" />
        <TextField label={t('Slot_GGR')} source="slot_ggr" />
        <TextField label={t('Casino_Rolling')} sortable={false} source="casino_rolling" />
        <TextField label={t('Slot_Rolling')} source="slot_rolling" />

      </SimpleShowLayout>
    );
  };

  const ResellerCompensation = () => {

    return (
      <SimpleShowLayout sx={{fontSize:"20px", fontWeight:"800px", color:"#000000"}}>

        <TextField label={t('Total_Users')} source="total_users" />
        <TextField label={t('Total_Games')} source="total_games" />
        <TextField label={t('Games_Won')} source="games_won" />
        <TextField label={t('Games_Lost')} source="games_lost" />
        <TextField label={t('Total_Amount')} source="total_amount" />
        <TextField label={t('Amount_Won')} source="amount_won" />
        <TextField label={t('Amount_Lost')} source="amount_lost" />
        <TextField label={t('Total_Earnings')} source="earnings" />
        <TextField label={t('Total_Loss')} source="loss" />

      </SimpleShowLayout>
    );
  };

  const ResellerBreakdown = () => {

    return (
      <SimpleShowLayout sx={{fontSize:"20px", fontWeight:"800px", color:"#000000"}}>

        <TextField label={t('ID')} source="id" />
        <FunctionField
          label={t('User_ID')}
          render={(record) => (
            <a href={`/${router.locale}/admin#/view-users-details/${record.encryptId} `}>
              <u>
                {" "}
                <TextField className="fw-bold" label="user_id" source="user_id" />
              </u>
            </a>
          )}
        />
        <TextField label={t('Role')} source="role" />
        <FunctionField
          label={t('Reseller')}
          render={(record) => (
            <a href={`/${router.locale}/admin#/view-users-details/${record.encryptResellerId} `}>
              <u>
                {" "}
                <TextField className="fw-bold" label={t('Reseller')} source="reseller_id" />
              </u>
            </a>
          )}
        />
        <TextField label={t('Game_Id')} source="i_game_id" />
        <TextField label={t('Action_Id')} source="i_action_id" />
        <TextField label={t('Vendor_Key')} source="vendor_key" />
        <TextField label={t('Game_Key')} source="game_key" />
        <TextField label={t('Transaction_Id')} source="transaction_id" />
        <TextField label={t('Game_Type')} source="game_type" />
        <TextField label={t('Amount')} source="amount" />

        <TextField label={t('Result')} source="result" />
        <TextField label={t('Date')} source="date" />

      </SimpleShowLayout>
    );
  };

  return (

    <>
      <br/>
      <div className="mt-5">
    
        <Typography variant="h5" component="h5"><strong>{t('Compensation Details')}: {nick_name}</strong></Typography>
        <br/>
        <Typography variant="h7" component="h7"><strong>{t('Start_Date')}: </strong>{(startDate!=null ? startDate : t('All_Time'))}</Typography>
        <br/>
        <Typography variant="h7" component="h7"><strong>{t('End_Date')}: </strong>{(endDate!=null ? endDate : t('All_Time'))}</Typography>
      
      </div>
    
      <div style={{marginTop:"30px"}}>
        <Typography variant="h5" component="h5">{t('Reseller_Details')}</Typography>
        <List sx={{
          margin: "0px", marginTop:"20px", paddingTop: "0px", 
      
          "& .RaList-actions": {
            display: "none",
          },
        }} resource={`get-user-details?id=${id} `} disableSyncWithLocation >
          <Datagrid expand={<ResellerDetails />} bulkActionButtons={false} optimized sx={{
            '& .column-id': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-nick_name': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-name': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-created_at': {
              display: { xs: 'none', md: 'table-cell' },
            }

          }}>
            <FunctionField
              label={t('Reseller_ID')}
              render={() => (
                <a href="#">
                  <u>
                    {" "}
                    <TextField label={t('Reseller_ID')} source="id" />
                  </u>
                </a>
              )}
            />
            <TextField label={t('Reseller_Nick')} sortable={false} source="nick_name" />
            <TextField label={t('Reseller_Name')} source="name" />
            <TextField label={t('Member_Since')} sortable={false} source="created_at" />
            
          </Datagrid>
        </List>
      </div>
    

      <div>
        <Typography variant="h5" component="h5">{t('Reseller_Rates')}</Typography>
        <List sx={{
          margin: "0px", marginTop:"20px", paddingTop: "0px", 
      
          "& .RaList-actions": {
            display: "none",
          },
        }} resource={`get-reseller-rate?id=${id} `} disableSyncWithLocation >
          <Datagrid expand={<ResellerRates />} bulkActionButtons={false} optimized sx={{
           
            '& .column-id': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-casino_ggr': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-slot_ggr': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-casino_rolling': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-slot_rolling': {
              display: { xs: 'none', md: 'table-cell' },
            }

          }}>
            <FunctionField
              label={t('ID')}
              render={(record) => (
                <a href="#">
                  <u>
                    {" "}
                    <TextField label={t('ID')} source="id" />
                  </u>
                </a>
              )}
            />
            <TextField label={t('Casino_GGR')} sortable={false} source="casino_ggr" />
            <TextField label={t('Slot_GGR')} source="slot_ggr" />
            <TextField label={t('Casino_Rolling')} sortable={false} source="casino_rolling" />
            <TextField label={t('Slot_Rolling')} source="slot_rolling" />
            
          </Datagrid>
        </List>
      </div>


      <div className='mt-0'>
        <Typography variant="h5" component="h5">{t('Reseller_Compensation_Details')}</Typography>
        <Typography variant="h7" component="h7"><strong>{t('Start_Date')}: </strong>{(startDate!=null ? startDate : t('All_Time'))}</Typography>
        <br/>
        <Typography variant="h7" component="h7"><strong>{t('End_Date')}: </strong>{(endDate!=null ? endDate : t('All_Time'))}</Typography>
        <List sx={{
          margin: "0px", marginTop:"20px", paddingTop: "0px", 
      
          "& .RaList-actions": {
            display: "none",
          },
        }} resource={`view-reseller-compensation-breakdown?displayedFilters={}&filter={"start":"${startDate}","end":"${endDate}"}&order=DESC&page=1&perPage=10&sort=id&id=${id}`}  disableSyncWithLocation >
          <Datagrid expand={<ResellerCompensation />} bulkActionButtons={false} optimized sx={{
            
        
            '& .column-total_users': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-total_games': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-games_won': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-games_lost': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-total_amount': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-amount_won': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-amount_lost': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-earnings': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-loss': {
              display: { xs: 'none', md: 'table-cell' },
            }

          }}>
            
            <FunctionField
              label={t('Total_Users')}
              render={() => (
                <a href="#">
                  <u>
                    {" "}
                    <TextField label={t('Total_Users')} source="total_users" />
                  </u>
                </a>
              )}
            />
            <TextField label={t('Total_Users')} source="total_users" />
            <TextField label={t('Total_Games')} source="total_games" />
            <TextField label={t('Games_Won')} source="games_won" />
            <TextField label={t('Games_Lost')} source="games_lost" />
            <TextField label={t('Total_Amount')} source="total_amount" />
            <TextField label={t('Amount_Won')} source="amount_won" />
            <TextField label={t('Amount_Lost')} source="amount_lost" />
            <TextField label={t('Total_Earnings')} source="earnings" />
            <TextField label={t('Total_Loss')} source="loss" />
            
          </Datagrid>
        </List>
      </div>
    

      <div className='mt-0'>
        <Typography variant="h5" component="h5">{t('Games_Bets_Breakdown')}</Typography>
 
        <Typography variant="h7" component="h7"><strong>{t('Start_Date')}: </strong>{(startDate!=null ? startDate : t('All_Time'))}</Typography>
        <br/>
        <Typography variant="h7" component="h7"><strong>{t('End_Date')}: </strong>{(endDate!=null ? endDate : t('All_Time'))}</Typography>
        <List sx={{
          margin: "0px", marginTop:"20px", paddingTop: "0px", 
      
          "& .RaList-actions": {
            display: "none",
          },
        }} resource={`view-betting-history-by-reseller?displayedFilters={}&filter={"start":"${startDate}","end":"${endDate}"}&order=DESC&page=1&perPage=10&sort=id&id=${id}`} disableSyncWithLocation >
          <Datagrid expand={<ResellerBreakdown />} bulkActionButtons={false} optimized sx={{
            
            '& .column-id': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-user_id': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-role': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-reseller_id': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-i_game_id': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-i_action_id': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-vendor_key': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-game_key': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-transaction_id': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-game_type': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-amount': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-result': {
              display: { xs: 'none', md: 'table-cell' },
            },
            '& .column-date': {
              display: { xs: 'none', md: 'table-cell' },
            }

          }}>
          
            <TextField label={t('ID')} source="id" />
            <FunctionField
              label={t('User_ID')}
              render={(record) => (
                <a href={`/${router.locale}/admin#/view-users-details/${record.encryptId} `}>
                  <u>
                    {" "}
                    <TextField className="fw-bold" label="user_id" source="user_id" />
                  </u>
                </a>
              )}
            />
            <TextField label={t('Role')} source="role" />
            <FunctionField
              label={t('Reseller')}
              render={(record) => (
                <a href={`/${router.locale}/admin#/view-users-details/${record.encryptResellerId} `}>
                  <u>
                    {" "}
                    <TextField className="fw-bold" label={t('Reseller')} source="reseller_id" />
                  </u>
                </a>
              )}
            />
            <TextField label={t('Game_Id')} source="i_game_id" />
            <TextField label={t('Action_Id')} source="i_action_id" />
            <TextField label={t('Vendor_Key')} source="vendor_key" />
            <TextField label={t('Game_Key')} source="game_key" />
            <TextField label={t('Transaction_Id')} source="transaction_id" />
            <TextField label={t('Game_Type')} source="game_type" />
            <TextField label={t('Amount')} source="amount" />

            <TextField label={t('Result')} source="result" />
            <TextField label={t('Date')} source="date" />
          </Datagrid>
        </List>
      </div>
    


    </>
  
  
  )

}

{/*


{ info.length > 0 && (

<>
<div className="mt-5">
    
          <Typography variant="h5" component="h5"><strong> {info[0].name_eng} - Details</strong></Typography>

          <Form record={{ id: info[0].id,  provider_idx: info[0].provider_idx, code: info[0].code, img_1: info[0].img_1, is_desktop: info[0].is_desktop, is_mobile: info[0].is_mobile, name_eng: info[0].name_eng, name_kor: info[0].name_kor, type: info[0].type, is_active: info[0].is_active }} >
            
            <TextInput source="id" value={ info[0].id} style={{width:"400px"}} disabled/> 

        <TextInput source="provider_idx" value={ info[0].provider_idx} style={{ width: "400px", marginLeft: "5px" }} disabled/> 

        <br />
                            
        <TextInput source="name_eng" value={ info[0].name_eng} style={{width:"400px"}} disabled/> 

        <TextInput source="name_kor" value={info[0].name_kor} style={{ width: "400px", marginLeft: "5px" }} disabled /> 
            
        <br />

        <TextInput source="img_1" value={ info[0].img_1} style={{width:"805px"}} /> 


        <br />
   
            <TextInput source="code" value={info[0].code} style={{ width: "265px", marginLeft: "5px" }} disabled /> 
            
            <TextInput source="is_desktop" value={info[0].is_desktop} style={{ width: "265px", marginLeft: "5px" }} disabled /> 
            
            <TextInput source="is_mobile" value={ info[0].is_mobile } style={{ width: "265px", marginLeft: "5px" }} disabled/> 

        <br/>
            
<TextInput source="type" value={ info[0].type} style={{ width: "397px", marginLeft: "5px" }} disabled/> 

<SelectInput source="is_active" choices={[
              { id: '1', name: 'Active' },
              { id: '0', name: 'InActive' },
            ]} style={{ width: "397px", marginLeft: "5px"  }} />

<br />


                            
</Form>
          
</div>

</>
    )}
    
          */}
    

