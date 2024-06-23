import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getRecentlyWithdrawHistoryByUser } from "../../database/withdraw_history";
import useTranslation from 'next-translate/useTranslation';
import { findOneById } from "../../database/users";
import styles from "./Withraw.module.scss";
import clsx from "clsx";
import { Typography } from "../../src/user/components/Typography";
import { MoneyInputGroup } from "../../src/user/components/MoneyInputGroup";
import { DefaultForm } from "../../src/user/components/DefaultForm";
import { connectToDatabase } from "../../database/connection";
import { UserMeDtoZ } from "../../dto/UserDto";
import { createPlainJson } from "../../utils/createPlainJson";
import { useGetBank } from "../../src/user/hooks/useGetBank";
import { WithdrawHistory } from "../../entities/withdraw_hisotry";

export type Props = {
  histories: WithdrawHistory[]
}

const Home = (props:Props) => {
  const { t } = useTranslation('common');
  const bankInfo = useGetBank();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bank_name = e.target.bank_name.value;
    const acc_num = e.target.acc_num.value;
    const acc_name = e.target.acc_name.value;
    const amount = Number(e.target.amount.value);
    if ((typeof amount !== 'number' || Number.isNaN(amount)))
      return alert(t('Invalid_details'));
    
    let data = {
      amount: amount,
      bank_name,
      acc_name,
      acc_num
    }

    
    const res = await fetch("/api/my-account/send-withdraw-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
      
    const result = await res.json();

    if (res.status != 201) return alert(result.message);

    alert(t('Request_sent_successfully'));

    location.reload();

  };
  return (
    <>
      <DefaultForm submitTitle={t('Send_Request')} title={t('Withdraw_Request')} onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-2">
            <div className="row">
              <div className="col-xs-12 col-md-4 mb-2">
                <label className="form-label">{t('Bank_Name')}</label>
                <input name="bank_name" className="form-control" disabled minLength={2} defaultValue={bankInfo?.data?.bank_name}/>
              </div>
              <div className="col-xs-12 col-md-4 form-group mb-2">
                <label className="form-label">{t('Account_Name')}</label>
                <input name="acc_name" className="form-control" disabled minLength={2} defaultValue={bankInfo?.data?.acc_name}/>
              </div>
              <div className="col-xs-12 col-md-4 form-group mb-2">
                <label className="form-label">{t('Account_Number')}</label>
                <input name="acc_num" className="form-control" disabled minLength={2} defaultValue={bankInfo?.data?.acc_num}/>
              </div>
            </div>
            <MoneyInputGroup moneies={[10000,30000,50000,100000,200000,500000,1000000]}/>
          </div>
      </DefaultForm>
   
      <section id="contact" className="contact" style={{padding:"30px 0px"}}>
        <div className="container aos-init aos-animate" data-aos="fade-up">

          <div className="section-title2" style={{textAlign:"left", justifyContent:"left",justifyItems:"left", marginBottom:"5px"}}>
            <h2 style={{textAlign:"left", justifyContent:"left",justifyItems:"left"}}>{t('Withdraw_History')}</h2>
          </div>
        
          <div style={{overflow: "auto", maxHeight:"500px",borderRadius:"0px", boxShadow: "0 0 10px rgba(214, 215, 216, 0.3)"}} className="table-responsive">

            <table className={clsx(styles.Table,"table table-dark table-hover table-bordered overflow-auto")}>
              <thead>
                <tr>
                  <th  scope="col">{t('Status')}</th>
                  <th  scope="col">{t('Amount')}</th>
                  <th  scope="col">{t('Bank_Name')}</th>
                  <th  scope="col">{t('Account_Name')}</th>
                  <th  scope="col">{t('Account_Number')}</th>
                  <th  scope="col">{t('Date')}</th>
                </tr>
              </thead>
              <tbody>
                {props.histories?.map((value, index) => (
                  <tr key={index}>
                    <td className="trx-type" data-label="Transection Type">{value.status}</td>
              
                    <td className="amount" data-label="Amount">{value.withdraw_amount.toLocaleString()} 원</td>
                      
                    <td className="date" data-label="Date">{value.bank_name}</td>
              
                    <td className="trx-id" data-label="Transection ID">{value.acc_name}</td>
                    <td className="trx-type" data-label="Transection Type">{value.acc_num}</td>
                    <td className="date" data-label="Date">{value?.created_at?.split('T')[0]}</td>
                  </tr>
              
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </section>      
    </>
  )

  
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session?.user) return {
    redirect: {
      destination: "/"+context.locale+"/signin",
      permanent: false
    }
  };
  const pool =  await connectToDatabase(); 
  const histories = await getRecentlyWithdrawHistoryByUser(pool)(session.user.id);

  return { 
    props: createPlainJson({
      histories
    })
  }
};

export default Home;
