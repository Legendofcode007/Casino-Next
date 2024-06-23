import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import useTranslation from 'next-translate/useTranslation';
import styles from "./Inbox.module.scss"
import clsx from "clsx";
import { AuthGaurd } from "../../src/user/containers/AuthGaurd";
import { getRecentlyInboxByUserId } from "../../database/inbox";
import { connectToDatabase } from "../../database/connection";
import { createPlainJson } from "../../utils/createPlainJson";
import { Inbox } from "../../entities/inbox";
import { format  } from 'date-fns'
import { useReadInbox } from "../../src/user/hooks/useReadInbox";
import { useGetUnreadCount } from "../../src/user/hooks/useGetUnreadCount";


type InboxRowProps = {
  inbox: Inbox
}
const InboxRow = ({inbox}:InboxRowProps) => {
  const [isCollaps,setIsCollaps] = useState(false);
  const [status,setStatus] = useState(inbox.status)
  const {mutateAsync} = useReadInbox()
  const {refetch} = useGetUnreadCount({cache:'no-cache'})
  
  const handleRead = async () => {
    if(status === 'unread') {
      setStatus('read');
      await mutateAsync({id:inbox.id});
      refetch();
    }

    setIsCollaps((v)=>!v)
  }

  const statusText = useMemo(()=>{
    if(status === 'read') return '읽음'
    if(status === 'unread') return '안읽음'
    if(status === 'deleted') return '삭제됨'
  },[status])
  return <>
    <tr onClick={handleRead} style={{cursor:'pointer'}}>
      <td className="trx-id" data-label="Transection ID">{inbox.id}</td>
      <td className="trx-type" data-label="Transection Type">{inbox.subject}</td>

      <td className="trx-type" data-label="Transection Type">{statusText}</td>
      <td className="date" data-label="Date">{format(new Date(inbox.created_at),'yy/MM/dd HH:mm')}</td>
    </tr>
    <tr className={clsx(!isCollaps && styles.Hide)} >
      <td colSpan={4}>
        <div className={styles.Message}>
          {inbox.message?.split('\n').map((v,idx)=><p key={idx}>{v}</p>)}
        </div>
      </td>
    </tr>
  </>
}


type Props = {
  inboxes: Inbox[]
}




const Page = (props:Props) => {
  const { t } = useTranslation('common');
  
  return (
    <AuthGaurd redirect="/signin">
      {()=> 
      <>
        <section id="contact" className="contact" style={{padding:"30px 0px"}}>
          <div className="container aos-init aos-animate" data-aos="fade-up">

            <div className="section-title2" style={{textAlign:"left", justifyContent:"left",justifyItems:"left", marginBottom:"5px"}}>
              <h2 style={{textAlign:"left", justifyContent:"left",justifyItems:"left"}}>{t('Inbox')}</h2>
            </div>
          
            <div style={{overflow: "auto", maxHeight:"500px",borderRadius:"0px", boxShadow: "0 0 10px rgba(214, 215, 216, 0.3)"}} className="table-responsive">

              <table className={clsx(styles.Table,"table table-dark table-hover table-bordered overflow-auto")}>
                <thead>
                  <tr>
                
                    <th style={{minWidth:"120px"}} scope="col">{t('ID')}</th>
                    <th style={{minWidth:"350px"}} scope="col">{t('Subject')}</th>
                    <th style={{minWidth:"80px"}} scope="col">{t('Status')}</th>
                    <th style={{minWidth:"150px"}} scope="col">{t('Date')}</th>
                
                  </tr>
                </thead>
                <tbody>
                  {props.inboxes?.map((value, index:number) => (
                    <InboxRow key={index} inbox={value}/>
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

  const inboxes = await getRecentlyInboxByUserId(pool)(session.user.id);

    
  return { props: createPlainJson(
    { inboxes }
  )}
    
};

export default Page;
