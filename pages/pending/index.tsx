import type { NextPage, GetServerSideProps } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import useTranslation from 'next-translate/useTranslation';

const Page: NextPage = (props) => {
  const { t } = useTranslation('common');
  const session = useSession();

  useEffect(() => {
    if(session?.data?.user && !session?.data?.user?.approved) {
      signOut();
    }
  },[session]);

  if(session.status === 'loading') return <></>

  return (
    <>
      <div className="section-pending">
        <h2>{t('Approval_Pending')}</h2>
        <h3><span>{t("Your_account_is_pending_approval_Try_loggin_again_later")}</span></h3>
      </div>
    </>

  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session?.user?.approved === true) {
    return {
      redirect: {
        destination: "/" + context.locale,
        permanent: false
      }
    }
  }
     

  return { props:{}}
};

export default Page;