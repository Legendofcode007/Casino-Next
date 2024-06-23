import { useLocation } from 'react-router-dom';
import useTranslation from 'next-translate/useTranslation';
import { Typography } from "@mui/material";

export const Compose = (props) => {

  const { t } = useTranslation('common');

  const search = useLocation().search;

  let params = new URLSearchParams(search);
  let mailto = params.get('nick_name');
  
     
  const sendMail = async () => {

    let recipients = [];
    let subject = document.querySelector('#subject');
    let message = document.querySelector('#body');
    let recipient_email = document.querySelector('#to');
      
    const status = document.querySelector('#send_all')?.checked;

    if (!subject.value.trim().length)
      return alert(t('Invalid_details'));
    
    if (!message.value.trim().length)
      return alert(t('Invalid_details'));
    
    if (status == false) {
      if (!recipient_email.value.trim().length)
        return alert(t('Invalid_details'));
      
      recipients = recipient_email.value.split(',')
    }

   
    const res = await fetch("/api/admin/send-mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: subject.value,
        message: message.value,
        thread_id: null,
        type: status ? 'all': recipients.length === 1 ? 'one':'bulk',
        to: status ? undefined: recipients.length === 1 ? recipients[0]:recipients
      }),
    });
      
    const result = await res.json();

    if (res.status != 201) return alert(result.message);

    alert(t('Email_sent_successfully'));

    location.reload();

  }

  const sendAll = async (e) => {

    let status = document.querySelector('#send_all').checked;
    //console.log(status);

    if (status)
      document.querySelector('#to').style.display = "none";
    else
      document.querySelector('#to').style.display = "block";

  }

  const css = `
    /* The container */
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 18px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  margin-top:20px;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #ccc;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: #2196F3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container2 .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

input[type=text], select {
  width: 100%;
  padding: 12px 20px;
  margin-top:10px;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea, select {
  width: 100%;
  height: 190px;
  padding: 12px 20px;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.button2 {
  width: 100%;
  background-color: #4f3cc9;
  color: white;
  padding: 14px 20px;
  margin: 0px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #888888;
}
`
  
  return (

    <>
      {props.props && (

        <>
        
          <style>{css}</style>

          {/*Message MAIN Section*/}
          <div style={{marginTop:"30px"}} className="mt-4 w-full bg-white shadow-xl rounded-lg flex overflow-x-auto custom-scrollbar">

            {/*Message body Section*/}   
            <div className="flex-1 px-2">
              <div className="h-16 flex items-center">
              
                <Typography variant="h5" component="h5"><strong>{t('New_Message')}</strong></Typography>

              </div>
              <label className="container" style={{marginLeft:0}} >공지사항 보내기
                <input type="checkbox" id="send_all" name="send_all" value="send_all" onChange={sendAll} />
                <span className="checkmark"></span>
              </label>
                
              <div className="mb-6 pt-4">
              
                <div>
                  <input type="text" name="subject" id="subject" className="" placeholder={t('subject')} defaultValue={''} />
                </div>
                  
              
                <div>
                
                  <input type="text" name="to" id="to" className="" placeholder={'추가인원+'} defaultValue={mailto} />
                  <p style={{fontSize:"12px" ,marginTop:"3px"}} className="">* 쉼표로 구분된 여러 닉네임 추가 {'ex)닉네임1,닉네임2'}</p>
                </div>

                <div>
                  <textarea id="body" className="" placeholder={t('Message')}></textarea>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                  
                    <button className="button2" type="button" onClick={sendMail}>{t('Send')}</button>
                  
                  </div>

                </div>
              </div>
            </div>
            {/*END Message body Section*/}        

          </div>
          {/*END Message MAIN Section*/}  

        </>
      )}
    </>
  )

  return (
    <>
      {props.props && (
        <>
          {/*Message MAIN Section*/}
          <div style={{marginTop:"30px"}} className="mt-4 w-full bg-white shadow-xl rounded-lg flex overflow-x-auto custom-scrollbar">

            {/*Message body Section*/}   
            <div className="flex-1 px-2">
              <div className="h-16 flex items-center">
              
                <Typography variant="h5" component="h5"><strong>{t('New_Message')}</strong></Typography>

              </div>
              <FormGroup >
                  <FormControlLabel  control={<Checkbox size="medium" id="send_all" name="send_all" value="send_all" onChange={sendAll} />} label="모두에게 메세지 보내기"/>
              </FormGroup>
              <div className="mb-6 pt-4">
                <div>
                  <input type="text" name="subject" id="subject" className="" placeholder={t('subject')} defaultValue={''} />
                </div>
              
                <div>
                  <input type="text" name="to" id="to" className="" placeholder={t('To')} defaultValue={mailto} />
                  <p style={{fontSize:"12px" ,marginTop:"3px"}} className="">* {t('add_multiple_emails_comma_separated')}</p>
                </div>

                <div>
                  <textarea id="body" className="" placeholder={t('Message')}></textarea>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                  
                    <button className="button2" type="button" onClick={sendMail}>{t('Send')}</button>
                  
                  </div>

                </div>
              </div>
            </div>
            {/*END Message body Section*/}        

          </div>
          {/*END Message MAIN Section*/}  

        </>
      )}
    </>
  )

}