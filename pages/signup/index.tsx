import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Router from "next/router";
import { getCookie, hasCookie } from 'cookies-next';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from "next/router";
import Link from "next/link";
import { DefaultForm } from "../../src/user/components/DefaultForm";
import { useMemo, useState } from "react";
import { UserSignupBodyDto } from "../../dto/UserDto";

const Page: NextPage = () => {

  const { t } = useTranslation('common');
  const router = useRouter(); 
  const referral_code = useMemo(()=>{
    return router.query.ref
  },[router.query])

  const [check,setCheck] = useState(!!referral_code)

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    const user_name = e.target.user_name.value;
    const nick_name = e.target.nick_name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const phone = e.target.phone.value;
    const bank_name = e.target.bank_name.value;
    const acc_num = e.target.acc_num.value;

    let body:UserSignupBodyDto = {
      name: user_name,
      email,
      nick_name,
      password,
      phone,
      bank_name,
      acc_num
    };

    if(check && e.target.referral_code) {
      body.referral_code = e.target.referral_code
    }
    if (
      !email.trim().length ||
      !email.includes("@") ||
      !password.trim().length ||
      !nick_name.trim().length ||
      !phone.trim().length ||
      !user_name.trim().length
    )
      return alert(t('Invalid_details'));
    
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.status != 201) return alert(data.message);

    Router.push("/pending");

  };

  return (

    <>
      <DefaultForm onSubmit={handleSubmit} title={t('Sign_Up')} submitTitle={t('Sign_Up')}>
        <div className="d-flex flex-column gap-4">
          <div className="form-group">
            <input id="user_name" name="user_name" type="text" className="form-control form-control-lg" placeholder={t('First_and_last_name')} minLength={2} maxLength={12} required />
          </div>

          <div className="form-group">
            <input id="nick_name" name="nick_name" type="text" className="form-control form-control-lg" placeholder={t('Your_unique_nick_name')} minLength={3} maxLength={12} required />
          </div>

          <div className="form-group">
            <input id="email" name="email" type="text" className="form-control form-control-lg" placeholder={t('Email').toLowerCase()} minLength={3} maxLength={50} required />
          </div>

          <div className="form-group">
            <input id="phone" name="phone" type="text" className="form-control form-control-lg" placeholder={'Cell Phone Number "-" ex)010xxxxxxxx'} minLength={9} maxLength={11} required />
          </div>

          <div className="form-group">
            <input name="bank_name" type="text" className="form-control form-control-lg" placeholder={'Bank name'} minLength={2} maxLength={20} required />
          </div>

          <div className="form-group">
            <input name="acc_num" type="text" className="form-control form-control-lg" placeholder={'account number'} minLength={2}  required />
          </div>

          <div className="form-group">
            <input id="password" name="password" type="password" className="form-control form-control-lg" placeholder={t('Password').toLowerCase()} maxLength={20}
              minLength={8} required />
          </div>
          <div className="form-group">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" checked={check} onChange={()=>setCheck(v=>!v)} disabled={!!referral_code} value="" />
              <label className="form-check-label" style={{color:"#fff"}}>
              Whether you are a recommender or not
              </label>
            </div>
            {check && <input  name="referral_code"  className="form-control form-control-lg" placeholder={"Referral code"} maxLength={20}
              minLength={20} defaultValue={referral_code} readOnly={!!referral_code} />
            }
            <div className="d-flex flex-row-reverse mt-2" >
              <p style={{color:"#cdcdcd"}}>{t('Already_have_an_account?')}{" "}
                <Link href={`/${router.locale}/signin`} >{t('Sign_In')}</Link>
              </p>
            </div>
          </div>

          
        </div>
      </DefaultForm>
    
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {

  const session = await getSession(context);

  if (session) return {
    redirect: {
      destination: "/"+context.locale,
      permanent: false
    }
  };

  return { props: {} };
};

export default Page;
