import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { getRecentlyCustomerServices } from "../../database/customer_services";
import useTranslation from 'next-translate/useTranslation';
import styles from "./Deposit.module.scss"
import clsx from "clsx";
import { Button } from "../../src/user/components/Button";
import { AuthGaurd } from "../../src/user/containers/AuthGaurd";
import { createPlainJson } from "../../utils/createPlainJson";
import { connectToDatabase } from "../../database/connection";
import { useRouter } from "next/router";
import { CustomerServiceEntity } from "../../entities/customer_services";
import { CustomerServiceStatusToKorean } from "../../utils/enumTrnslate";
import { format } from 'date-fns'
import { RequestDepositAccountButton } from "../../src/user/containers/RequestDepositAccountButton";
type Props = {
  histories: CustomerServiceEntity[]
}

const Page = (props:Props) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  return (
    <AuthGaurd redirect="/signin">
      {()=> 
      <>
        <section id="contact" className="contact" style={{padding:"30px 0px"}}>
          <div className="container">
            <div className="d-flex flex-row justify-content-between">
              <div className="section-title2" style={{textAlign:"left", justifyContent:"left",justifyItems:"left", marginBottom:"5px"}}>
                <h2 style={{textAlign:"left", justifyContent:"left",justifyItems:"left"}}>문의목록</h2>
              </div>
              <div className="d-flex gap-1">
                <RequestDepositAccountButton label="계좌문의"/>
                <Button size="medium" animation onClick={()=>router.push('/cs/create')}>
                  문의하기
                </Button>
              </div>

            </div>

          
            <div style={{overflow: "auto", maxHeight:"500px",borderRadius:"0px", boxShadow: "0 0 10px rgba(214, 215, 216, 0.3)"}} className="table-responsive">

              <table className={clsx(styles.Table,"table table-dark table-hover table-bordered overflow-auto")}>
                <thead>
                  <tr>
                    <th colSpan={3} style={{minWidth:"300px"}} scope="col">제목</th>
                    <th colSpan={1} style={{minWidth:"100px"}} scope="col">{t('Status')}</th>
                    <th colSpan={1} style={{minWidth:"150px"}} scope="col">작성일시</th>
                  </tr>
                </thead>
                <tbody>
                  {props.histories?.map((value, index:number) => (
                    <tr key={index} style={{cursor:'pointer'}} onClick={()=>router.push(`/cs/${value.id}`)}>
                      <td colSpan={3}>{value.title}</td>
                      <td>{CustomerServiceStatusToKorean(value.status)}</td>
                      <td>{format(new Date(value.created_at),'yy/MM/dd HH:mm')}</td>
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
  const histories = await getRecentlyCustomerServices(pool)({
    user_id: session.user.id
  });

  return { props: createPlainJson({
    histories
  }) }
    
};

export default Page;
