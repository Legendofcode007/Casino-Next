import type { NextPage, GetServerSideProps } from "next";
import { getSession, useSession} from "next-auth/react";
import { findOneById, findUserAccount } from "../../database/users";
import useTranslation from 'next-translate/useTranslation';
import { connectToDatabase } from "../../database/connection";
import { AuthGaurd } from "../../src/user/containers/AuthGaurd";
import { useGetMe } from "../../src/user/hooks/useGetMe";
import { DefaultForm } from "../../src/user/components/DefaultForm";

const Page: NextPage = (props) => {
  const {data:session} = useSession();
 
  const { t } = useTranslation('common');
  
  const {data:me} = useGetMe();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = me?.id;
    const name = e.target.full_name.value;

    if (!name.trim().length)
      return alert(t('Valid_Name_required'))
    let data = {
      id: id,
      name:name
    }
    const res = await fetch("/api/my-account/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
      
    const result = await res.json();

    if (res.status != 201) return alert(result.message);

    alert(t('Updated_successfully'));

    location.reload();
    
  }
  return <AuthGaurd redirect="/signin">
    {(user) => 
      <>
        <DefaultForm onSubmit={handleSubmit} submitTitle={t('Update_Profile')} title={t('Profile_Settings')}>
          <div className="row">
            <div className="col-xs-12 col-sm-6 form-group mt-2">
              <label className="form-label">{t('Name')}</label>
              <input className="form-control" id="full_name" name="full_name" defaultValue={user.name} maxLength={100} placeholder={t('Name')} type="text" />
            </div>
            <div className="col-xs-12 col-sm-6 form-group mt-2">
              <label className="form-label">{t('Email')}</label>

              <input className="col-xs-12 col-sm-6 form-control form--control style-two" id="email" name="email" defaultValue={user.email}
                type="text" placeholder={t('Email')}  disabled />
            </div>

            <div className="col-xs-12 col-sm-6 form-group mt-2">
              <label className="form-label">{t('Nick_Name')}</label>
                
              <input className="form-control form--control style-two" id="nick_name" name="nick_name" defaultValue={user.nick_name}
                type="text" placeholder={t('Nick_Name')} disabled />
            </div>
            
            <div className="col-xs-12 col-sm-6 form-group mt-2">
              <label className="form-label">{t('Role')}</label>
              <input className="form-control form--control style-two " id="role" name="role" defaultValue={user.role}
                type="text" placeholder={t('Role')} disabled />
            </div>

            <div className="col-xs-12 form-group mt-2">
              <label className="form-label">{t('Betting_Limit')}</label>
              <input className="form-control form--control style-two" name="betting_limit" 
                type="text" placeholder={t('Betting_Limit')} value={me?.betting_limit}  disabled />
            </div>
          </div>
        </DefaultForm>
    </>}  
  </AuthGaurd>
 
}



export default Page;