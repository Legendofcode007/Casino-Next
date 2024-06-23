import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { findUserAccount } from "../../database/users";
import useTranslation from 'next-translate/useTranslation';
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthGaurd } from "../../src/user/containers/AuthGaurd";
import { useGetBank } from "../../src/user/hooks/useGetBank";
import { DefaultForm } from "../../src/user/components/DefaultForm";

const Page: NextPage = (props) => {

  const { t } = useTranslation('common');
  const router = useRouter();
  const {data} = useGetBank();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bank_name = e.target.bank_name.value;
    const acc_name = e.target.acc_name.value;
    const acc_num = e.target.acc_num.value;

    if (!bank_name.trim().length)
      return alert(t('Invalid_details'));
 
    if (!acc_name.trim().length)
      return alert(t('Invalid_details'));
    
    if (!acc_num.trim().length)
      return alert(t('Invalid_details'));
    
    let data = {
      bank_name: bank_name,
      acc_name: acc_name,
      acc_num: acc_num
    }

    const res = await fetch("/api/my-account/bank", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
      
    const result = await res.json();

    if (res.status != 201 && res.status != 200) return alert(result.message);

    alert(t('Updated_successfully'));

    location.reload();

  }

  return (
    <AuthGaurd redirect="/signin">
      {(user)=> {
        return <DefaultForm 
          onSubmit={handleSubmit}
          title={t('Bank_Information')}
          submitTitle={t('Update')}
        
        >
          <div className="row">
            <div className="col-xs-12  form-group">
              <label className="form-label">{t('Bank_Name')}</label>
              <input className="form-control" id="bank_name" name="bank_name" defaultValue={data?.bank_name} maxLength={100} placeholder={t('Bank_Name')} type="text" />
            </div>

            <div className="col-xs-12 mt-2 form-group">
              <label className="form-label">{t('Account_Name')}</label>
              <input className="form-control" id="acc_name" name="acc_name" defaultValue={data?.acc_name} maxLength={100} placeholder={t('Account_Name')} type="text" />
            </div>
            
            <div className="col-xs-12 mt-2 form-group">
              <label className="form-label">{t('Account_Number')}</label>
              <input className="form-control" id="acc_num" name="acc_num" defaultValue={data?.acc_num} maxLength={100} placeholder={t('Account_Number')} type="text" />
            </div>
          </div>
      </DefaultForm>
      }}
    </AuthGaurd>
  )
}



export default Page;