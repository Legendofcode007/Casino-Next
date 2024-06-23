import { Typography } from "@mui/material";
import { SaveButton, SelectInput, TextInput, Form } from 'react-admin';
import useTranslation from 'next-translate/useTranslation';

export const CreateNotice = props => {

  const { t } = useTranslation('common');

  const validate = (obj) => {

    //console.log('obj', obj)
    const errors = {};

    if (!obj.subject.trim().length)
      errors.subject = t('Required');
    
    if (!obj.message.trim().length)
      errors.message = t('Required');
    
    
    return errors;
    
  };


  const postSave = async (data) => {
  
    const res = await fetch("/api/admin/notice-boards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.status != 201) return alert(result.message);

    alert(t('Created_Successfully'))

    location.reload()
  

  };

  return (
    <>
      
      <Typography variant="h4" mt={4} mb={0}>
        {" "}
        {t('Create_Notice')}
      </Typography>
      

      <Form record={{ subject: '', message: '' }}  onSubmit={postSave} validate={validate}>
        
        <TextInput source="subject" defaultValue='' style={{ width: "800px" }} /> 
        
        <br />
        <TextInput rows={6} source="message" defaultValue='' style={{ width: "800px",  marginLeft: "5px" }} multiline /> 

        <br />

        <SaveButton />
        
      </Form>
      

     
    </>
  )



}

