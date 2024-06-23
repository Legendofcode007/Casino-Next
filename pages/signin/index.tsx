import Link from "next/link";
import type { NextPage, GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";
import Router from "next/router";
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from "next/router";
import { DefaultForm } from "../../src/user/components/DefaultForm";


const Page: NextPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email.trim().length || !email.includes("@") || !password.trim().length)
      return alert(t('Invalid_details'));

    const status = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    if (status.error) return alert(status.error);

    const session = await getSession();

    if (!session.user.approved) {
      Router.push("/pending");
    }
    else {  
      Router.push("/");
    }

  };

  return (
    <DefaultForm onSubmit={handleSubmit} title={t('Sign_In')} submitTitle={t('Sign_In')}>
      <div className="d-flex flex-column gap-4">
        <div className="col-xs-12 form-group">
          <input id="email" name="email" type="text" className="form-control form-control-lg" placeholder={t('Email').toLowerCase()} maxLength={50} required />
        </div>
        
        <div className="col-xs-12 form-group">
          <input id="password" name="password" type="password" className="form-control form-control-lg" placeholder={t('Password').toLowerCase()} maxLength={20}
            minLength={8} required />

          <div className="d-flex flex-row-reverse mt-2" >
            <Link href={`/${router.locale}/signup`} className="sent-message2">{t('Sign_Up')}</Link>
          </div>
        </div>
       
      </div>
    </DefaultForm>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  //console.log(session);

  if (session) return {
    redirect: {
      
      destination: "/" + context.locale + "/",
      permanent: false
    }
  };

  return { props: {} };
};

export default Page;
