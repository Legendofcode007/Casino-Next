import { SaveButton, SelectInput, TextInput, Form } from 'react-admin';
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import useTranslation from 'next-translate/useTranslation';

export const NoticeDetails = () => {

  const { t } = useTranslation('common');

  const [ noticeInfo, setNoticeInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {

    if (!loading) {

      setLoading(true);
        
      getNoticeInfo()
        .then(items => {
          setNoticeInfo(items)
        })
            
    }//noticeInfo

  }, [loading])

  function getNoticeInfo() {
    return fetch(`/api/admin/get-notice-details?id=` + id)
      .then(data => data.json())
  }

  const validate = (obj) => {

    const errors = {};

    if (!obj.subject)
      errors.subject = t('Required');
    else if (!obj.subject.trim().length)
      errors.subject = t('Required');
    
    if (!obj.message)
      errors.message = t('Required');
    else if (!obj.message.trim().length)
      errors.message = t('Required');
   
    return errors;
    
  };


  const postSave = async (data) => {
  
    const res = await fetch("/api/admin/update-notice", {
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

  };

  return (

    <>
      { noticeInfo.length > 0 && (

        <>
          <div className="mt-5">
    
            <Typography variant="h5" component="h5"><strong> {noticeInfo[0].subject} - {t('Details')}</strong></Typography>
                        
            <Form onSubmit={postSave} validate={validate} record={{ id: noticeInfo[0].id, subject: noticeInfo[0].subject, message: noticeInfo[0].message }} >
            
              <TextInput type="text" source="id" value={noticeInfo[0].id} style={{ width: "800px" }} disabled />
            
              <br />
                            
              <TextInput source="subject" value={noticeInfo[0].subject} style={{ width: "800px" }} />
            
              <br />

              <TextInput source="message" rows={6} value={ noticeInfo[0].message} style={{ width: "800px", marginLeft: "5px" }} multiline /> 

              <br />

        
              <SaveButton label={t('Update')} style={{ width: "300px" }} />
               
           
      
                            
            </Form>
          
          </div>

        </>
      )}
    </>
  )

}