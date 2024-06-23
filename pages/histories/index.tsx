import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import useTranslation from 'next-translate/useTranslation';
import styles from "./Histories.module.scss"
import clsx from "clsx";
import { AuthGaurd } from "../../src/user/containers/AuthGaurd";
import { BettingResultToKorean, gameTypeToKorean } from "../../utils/enumTrnslate";
import { getRecentlyBettingHistory } from "../../database/betting_history";
import { connectToDatabase } from "../../database/connection";
import { createPlainJson } from "../../utils/createPlainJson";
import { BettingHistory } from "../../entities/betting_history";
import { format } from 'date-fns'

type Props = {
  histories: BettingHistory[]
}

const Page = ({histories}:Props) => {
  const { t } = useTranslation('common');
  
  return (
    <AuthGaurd redirect="/signin">
      {()=> 
      <>
        <section id="contact" className="contact" style={{padding:"30px 0px"}}>
          <div className="container aos-init aos-animate" data-aos="fade-up">

            <div className="section-title2" style={{textAlign:"left", justifyContent:"left",justifyItems:"left", marginBottom:"5px"}}>
              <h2 style={{textAlign:"left", justifyContent:"left",justifyItems:"left"}}>{t('Betting_History')}</h2>
            </div>
          
            <div style={{overflow: "auto", maxHeight:"500px",borderRadius:"0px", boxShadow: "0 0 10px rgba(214, 215, 216, 0.3)"}} className="table-responsive">

              <table className={clsx(styles.Table,"table table-dark table-hover table-bordered overflow-auto")}>
                <thead>
                  <tr>
                    <th style={{minWidth:"150px"}} scope="col">{t('Date')}</th>
                    <th style={{minWidth:"80px"}} scope="col">게임종류</th>
                    <th style={{minWidth:"250px"}} scope="col">{t('Amount')}</th>
                    <th style={{minWidth:"80px"}} scope="col">배팅결과</th>

                  </tr>
                </thead>
                <tbody>
                  {histories?.map((value:any, index:number) => (
                    <tr key={index}>
                      <td className="date" data-label="Date">{format(new Date(value.date),'yy/MM/dd HH:mm')}</td>
                      <td className="trx-id" >{gameTypeToKorean(value.game_type)}</td>
                      <td className="amount" data-label="Amount">{value.amount} 원</td>
                      <td className="trx-type" >{BettingResultToKorean(value.result)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
    </>}
    </AuthGaurd>
  )
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session?.user) return {
    redirect: {
      
      destination: "/"+context.locale+"/signin", permanent: false
    }
  };

  const pool = await connectToDatabase();


  const histories = await getRecentlyBettingHistory(pool)({
    user_id: session.user.id
  });
    
  return { props: createPlainJson({
    histories
  }) }
    
};

export default Page;
