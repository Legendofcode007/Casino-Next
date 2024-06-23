import { GetServerSideProps } from "next";
import styles from "./CsDetail.module.scss"
import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../database/connection";
import { findOneById } from "../../database/customer_services"
import { createPlainJson } from "../../utils/createPlainJson";
import { CustomerServiceEntity } from "../../entities/customer_services";
import { format } from 'date-fns'
import { Button } from "../../src/user/components/Button";
import clsx from "clsx";
import { useRouter } from "next/router";

type Props = {
  cs: CustomerServiceEntity
}

export const CSDetail = ({cs}:Props) => {
  const router = useRouter();
  return <section className={clsx(styles.CSDetailWrap,"container d-flex flex-column align-items-center gap-4")}>
    <div className={styles.CSDetail}>
      <div className={styles.Title}>
        <h5>{cs.title}</h5>
        <h6 className={styles.Date}>{format(new Date(cs.created_at),'yy/MM/dd HH:mm')}</h6>
      </div>
      <div className={styles.Description}>
        {cs.description.split('\n').map((v,idx)=><p key={idx}>{v}</p>)}
      </div>
      <div className={styles.Title}>
        <p className={cs.status === 'pending' ? styles.Pending:styles.Success}>{cs.status === 'pending' ? "답변대기":"단변완료"}</p>
        <p className={styles.Date}>{cs.status === 'success' && format(new Date(cs.processed_at),'yy/MM/dd HH:mm')}</p>
      </div>
      {cs.status === 'success' && <div className={styles.Description}>
        {cs.answer_description?.split('\n').map((v,idx)=><p key={idx}>{v}</p>)}
      </div>}
    </div>
    <div className="d-flex flex-row justify-content-center" style={{width:'100%'}}>
      <Button size="medium" animation onClick={()=>router.push('/cs')}>목록</Button>
    </div>
  </section>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session?.user) return {
    redirect: {
      destination: "/"+context.locale+"/signin", permanent: false
    }
  };
  
  if(Number.isNaN(Number(context.params.id))) {
    return {
      redirect: {
        destination:'/cs',
        permanent:false
      }
    }
  }
  const pool = await connectToDatabase();

  const cs = await findOneById(pool)(context.params.id);
  if(session.user.id !== cs?.user_id) return {
    redirect: {
      destination: '/cs',
      permanent:false
    },
  }
    
  return { props: createPlainJson({
    cs
  })}
    
};



export default CSDetail;