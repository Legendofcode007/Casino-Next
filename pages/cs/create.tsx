import useTranslation from "next-translate/useTranslation";
import { DefaultForm } from "../../src/user/components/DefaultForm"
import { AuthGaurd } from "../../src/user/containers/AuthGaurd"
import { useRouter } from "next/router";




export const CreateCs = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    
    let data = {
      title,
      description
    } 
    

    const res = await fetch("/api/cs/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
      
    const result = await res.json();

    if (res.status != 201) return alert(result.message);

    alert(t('Request_sent_successfully'));

    router.back();

  };
  return <AuthGaurd redirect="/signin">
    {()=> 
      <>
        <DefaultForm title="문의하기" submitTitle={t('Send')}  onSubmit={handleSubmit}>
          <div className="col-xs-12">
            <label className="form-label">{t('Subject')}</label>
            <input name="title" className="form-control" minLength={2} maxLength={45} required/>
          </div>
          <div className="col-xs-12">
            <label className="form-label">{t('Description')}</label>
            <textarea rows={5} name="description" className="form-control" minLength={2} maxLength={1000} required/>
          </div>
        </DefaultForm>
    </>}
</AuthGaurd>
}

export default CreateCs;