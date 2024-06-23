import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import useTranslation from 'next-translate/useTranslation';
import { findUserAccount } from "../../database/users";
import { DefaultForm } from "../../src/user/components/DefaultForm";

const Page: NextPage = (props) => {

  const { t } = useTranslation('common');

  const handleSubmit = async (e) => {

    e.preventDefault();
        
    //console.log(JSON.stringify(props))

    //let recipients = [];
    let subject = document.querySelector('#subject');
    let message = document.querySelector('#body');
    //let recipient_email = document.querySelector('#to');

    if (!subject.value.trim().length)
      return alert(t('Invalid_details'));
    
    if (!message.value.trim().length)
      return alert(t('Invalid_details'));
        
    const res = await fetch("/api/my-account/send-mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: subject.value,
        message: message.value,
      }),
    });
      
    const result = await res.json();

    if (res.status != 201) return alert(result.message);

    alert(t('Email_sent_successfully'));

    location.reload();

  }

  return (
    <>
      <DefaultForm onSubmit={handleSubmit} title={t('Compose')} submitTitle={t('Send')} >
        <div className="form-group">
          <label className="form-label">{t('Subject')}</label>

          <input className="form-control" name="subject" id="subject" placeholder={`${t('Subject')}...`}  defaultValue={''} type="text" />            

        </div>

        <div className="form-group">
          <label className="form-label">{t('Message')}</label>
          <textarea rows={8} className="form-control" id="body" name="body" placeholder={`${t('Message')}...`} defaultValue={''}
          ></textarea>
        </div>
      </DefaultForm>
    </>
  
  );
  
};

export const getServerSideProps: GetServerSideProps = async (context) => {

  const session = await getSession(context);
    
  if (!session) return {
    redirect: {
      
      destination: "/" + context.locale + "/signin",
      permanent: false
    }
  };

  let userId = session.user.id;
  let user = await findUserAccount(userId);
    
  return { props: {user: JSON.parse(JSON.stringify(user))} }
    
};

export default Page;
