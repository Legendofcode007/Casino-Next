import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import useTranslation from 'next-translate/useTranslation';
import { getNoticeHistory } from "../database/notice_board"; 
import { getDepositHistory } from "../database/deposit_history";
import { getWithdrawHistory } from "../database/withdraw_history";
import { Hero } from "../src/user/components/Hero"
import { Button } from "../src/user/components/Button";
import { VisualBox } from "../src/user/components/VisualBox";
import { format } from 'date-fns'
import styles from "./Index.module.scss"
import { createPlainJson } from "../utils/createPlainJson";


const Page: NextPage = ({notice,deposit,withdraw}:any) => {
   const { t } = useTranslation('common');
   const router = useRouter();

  
   return (<section className={styles.Index}>
     <Hero>
    
    </Hero>
     <section className="d-flex flex-column p-0">
        <VisualBox 
          title="CASINO"
          subTitle="A hot bout" 
          src="/images/visual_entity_casino.png"
          size="large"

        >
          <Button size="large" onClick={()=>router.push(`/vendors/casino`)} >
            PLAY GAME
          </Button>
        </VisualBox>
        <VisualBox 
          title="SLOT GAMES" 
          subTitle="Turn it! Hit the jackpot!" 
          src="/images/visual_entity_slot.png"
          size="large"
        >
          <Button size="large" onClick={()=>router.push(`/vendors/slot`)} >
            PLAY GAME
          </Button>
        </VisualBox>
     </section>
     <section style={{ padding: "0px 0px", marginTop: "-200px", marginBottom: "-50px"}} id="team" className="mc5">
       <div className="container aos-init aos-animate mc2" data-aos="fade-up">
       </div>
     </section>
      
     <section style={{padding:"0px 0px", marginTop:"70px", marginBottom:"50px"}}  id="team" className="team section-bg">
       <div className="container aos-init aos-animate" data-aos="fade-up">
         <div className="row justify-content-center">
           <div className="p-2 col-lg-4 col-md-6 p-0 d-flex align-items-stretch aos-init aos-animate padding-2 m-0" data-aos="fade-up" data-aos-delay="100">

             <table className="table table-borderless table-dark table-hover">
               <thead>
                 <tr>
                   <th scope="row" style={{fontSize:"18px"}}>{t('Notice_Board')}</th>
                   <th scope="col"></th>

                 </tr>
               </thead>

               <tbody>
                 {notice?.map((value:any,idx:number)=>{
                  'use client';
                  return (
                   <tr key={idx}>
                     <th  style={{fontSize:"14px"}} scope="row">{value.subject}</th>
                     <td style={{fontSize:"14px"}}>{format(new Date(value?.created_at),'HH:mm:ss')}</td>
                   </tr>
                 )})}
                
   
               </tbody>
             </table>              
           </div>

           <div className="p-2 col-lg-4 col-md-6 p-0 d-flex align-items-stretch aos-init aos-animate padding-2 m-0" data-aos="fade-up" data-aos-delay="100">

             <table className="table table-borderless table-dark table-hover">
               <thead>
                 <tr>
                   <th scope="row" style={{fontSize:"18px"}}>{t('Deposit_History')}</th>
                   <th scope="col"></th>
                   <th scope="col"></th>

                 </tr>
               </thead>

               <tbody>
                 {deposit?.map((value:any,idx:number)=>{
                  'use client'
                  return (
                   <tr key={idx}>
                     <th  style={{fontSize:"14px"}} scope="row">{value.nick_name}</th>
                      
                     <th style={{ fontSize: "14px" }} scope="row">{Number(value.deposit_amount).toLocaleString()} 원</th>
                      
                     <td style={{ fontSize: "14px" }}>{format(new Date(value?.created_at),'HH:mm:ss')}</td>
                   </tr>
                 )})

                 }
   
               </tbody>
             </table>              
           </div>



           <div className="p-2 col-lg-4 col-md-6 p-0 d-flex align-items-stretch aos-init aos-animate padding-2 m-0" data-aos="fade-up" data-aos-delay="100">

             <table className="table table-borderless table-dark table-hover">
               <thead>
                 <tr>
                   <th scope="row" style={{fontSize:"18px"}}>{t('Withdraw_History')}</th>
                   <th scope="col"></th>
                   <th scope="col"></th>

                 </tr>
               </thead>

               <tbody>
                 {withdraw?.map((value:any,idx:number)=>{
                  'use client'
                  return (
                   <tr key={idx}>
                     <th  style={{fontSize:"14px"}} scope="row">{value.nick_name}</th>
                            
                     <th style={{ fontSize: "14px" }} scope="row">{Number(value.withdraw_amount).toLocaleString()} 원</th>
                            
                     <td style={{ fontSize: "14px" }}>{format(new Date(value?.created_at),'HH:mm:ss')}</td>
                   </tr>
                 )})
                 }
   
               </tbody>
             </table>              
           </div>

         </div>
       </div>
     </section>


   </section>);
  
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let notice = await getNoticeHistory();
  let deposit = await getDepositHistory();
  let withdraw = await getWithdrawHistory();
  
  
  return { props: createPlainJson({
    notice, 
    deposit, 
    withdraw
  })}
    
};

export default Page;
