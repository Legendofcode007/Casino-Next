import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  Button,
  SimpleShowLayout,
  useRecordContext
} from "react-admin";
import { Typography, Grid } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from "next/router";

export const ViewResellersCompensation = () => {

  const router = useRouter();

  const { t } = useTranslation('common');

  const search = useLocation().search;

  const update = async () => {

    if (!startDate) {
      await reset()
      return;
    }
    else if (!endDate) {
      await reset()
      return;
    }

    let url = '/admin#/view-resellers-compensation?displayedFilters={}&filter={"start":"' + startDate.toISOString().split('T')[0] + '", "end":"' + endDate.toISOString().split('T')[0] + '"}&order=DESC&page=1&perPage=10&sort=id';

    location.href = '/'+router.locale+url;

  }

  const reset = async () => {

    location.href = '/'+router.locale+'/admin#/view-resellers-compensation?displayedFilters={}&filter={}&order=DESC&page=1&perPage=10&sort=id';

  }

  let filter = new URLSearchParams(search).get("filter");
  filter = JSON.parse(filter)
  
  let start = null;
  let end = null;

  if(filter.start)
    start = new Date(filter.start);
  
  if(filter.end)
    end = new Date(filter.end);

  let [startDate, setStartDate] = useState(start);
  let [endDate, setEndDate] = useState(end);

  const startCalender = (e) => {
   
    setStartDate(e)
  }

  const endCalender = (e) => {
    setEndDate(e)
  }
  
  useEffect(() => {
    
  }, [startDate, endDate])
  
  const PostShow = () => {
    //const record = useRecordContext();
    //console.log(JSON.stringify(record))
    return (
      
      <SimpleShowLayout sx={{fontSize:"20px", fontWeight:"800px", color:"#000000"}}>
      
        <TextField label={t('Reseller_ID')} source="id" />

        <FunctionField
          label={t('Reseller_Nick')}
          render={(record) => (
            <a href={`/${router.locale}/admin#/view-users-details/${record.encryptId} `}>
              <u>
                {" "}
                <TextField label={t('Reseller_Nick')} source="nick_name" />
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

        <FunctionField
          label={t('Details')}
          render={(record) => (
            <a href={`/${router.locale}/admin#/view-compensation-details/${record.encryptId}?start=${startDate}&end=${endDate}&nick_name=${record.nick_name}`}>
              <u>
                {t('Details')}
              </u>
            </a>
          )}
        />
     
      </SimpleShowLayout>
    );
  };

  return (
    <>
 


      <Grid  container spacing={22} style={{'zIndex':999999999}}>

        <Grid  item xs={1}>
          
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}  > {t('Start_Date')}</Typography>
          <DatePicker
        
            selected={startDate}
            onChange={startCalender}
            showMonthDropdown
            useShortMonthInDropdown
            placeholderText="Start Date"
            
          />
          
        </Grid>
        
        <Grid item xs={1}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} > {t('End_Date')}</Typography>

          <DatePicker
         
            selected={endDate}
            onChange={endCalender}
            showMonthDropdown
            useShortMonthInDropdown
            placeholderText=" End Date "
          />
          
        </Grid>



      </Grid>


      <Grid sx={{marginTop:"4px"}}  container spacing={0}>

        <Grid sx={{justifyContent:"right",alignContent:"right", alignItems:"right", textAlign:"right"}}  item xs={2.65}>
          <button type="button" style={{paddingLeft:"15px",paddingRight:"15px",paddingTop:"8px",paddingBottom:"8px", color:"white", background:"#4f3cc9", borderRadius:"10px", cursor:"pointer", zIndex:"9999999"}}  onClick={update} >{t('Update')}</button>
        </Grid>



      </Grid>

      <List sx={{
        margin: "0px", marginTop:"20px", paddingTop: "0px", 
      
        "& .RaList-actions": {
          display: "none",
        },
      }}
      className="mt-0 py-0"
      sort={{ field: "id", order: "DESC" }}
      >

        <Datagrid expand={<PostShow />} bulkActionButtons={false} sx={{
          marginTop: "0px",
          paddingTop:"0px",
          '& .column-id': {
            display: { xs: 'none', md: 'table-cell' },
          },
          '& .column-nick_name': {
            display: { xs: 'none', md: 'table-cell' },
          },
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
          },
          '& .column-details': {
            display: { xs: 'none', md: 'table-cell' },
          },

        }} >
          <TextField label={t('Reseller_ID')} source="id" />

          <FunctionField
            label={t('Reseller_Nick')}
            render={(record) => (
              <a href={`/${router.locale}/admin#/view-users-details/${record.encryptId} `}>
                <u>
                  {" "}
                  <TextField label={t('Reseller_Nick')} source="nick_name" />
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

          <FunctionField
            label={t('Details')}
            render={(record) => (
              <a href={`/${router.locale}/admin#/view-compensation-details/${record.encryptId}?start=${startDate}&end=${endDate}&nick_name=${record.nick_name}`}>
                <u>
                  {t('Details')}
                </u>
              </a>
            )}
          />
          
        </Datagrid>
      </List>
    </>
  );
};
