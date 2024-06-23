import { useEffect, useState } from "react";
import useTranslation from 'next-translate/useTranslation';
import Link from "next/link";

export const Sent = (props) => {
  const { t } = useTranslation('common');

  const [mail, setMail] = useState([]);
  const [activeMail, setActiveMail] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) {

      setLoading(true)
        
      // let mounted = true;
      getMail()
        .then(items => {
          setMail(items)
          setActiveMail(items[0])
        })
            
    }//userInfo

    //return () => mounted = false;
  }, [loading,activeMail])

  function getMail() {
    return fetch(`/api/admin/sent-mail?id=` + props.props.id)
      .then(data => data.json())
  }
   
  const updateActiveMail = async (e) => {
    e.preventDefault();

    let index = e.currentTarget.dataset.index;

    setActiveMail(mail[index])
  }

  return (

    <>
      {mail.length > 0 && (
        <>
          <div style={{marginLeft:"20px",marginRight:"20px"}} className="mt-4 custom--card card--lg">
            <div className="mt-8 row message-wrapper rounded shadow mb-20">
              <div className="col-md-4 message-sideleft" style={{overflow: "auto", maxHeight:"550px"}}>
                <div className="panel">
                  <div className="panel-heading">
                    <div className="clearfix"></div>
                  </div>
                  <div className="panel-body no-padding">
                    <div className="ml-0 list-group no-margin list-message">
                 
                      {mail.map((value, index) => (
                        <Link key={index} href="#" data-index={index} onClick={updateActiveMail} className={activeMail.id == value.id ? "ml-3 list-group-item active" : "ml-3 list-group-item"} >
                          <h4 style={{marginLeft:"15px",marginTop:"5px"}} className="list-group-item-heading">{value.recipient_nick_name.toUpperCase()}<small style={{marginLeft:"5px"}}  className="ml-2">{value?.created_at?.split('.000Z')[0]}</small></h4>
                          <p style={{fontSize:"18px", marginLeft:"15px"}} className="list-group-item-text">
                            <strong>{value.thread_id !=null ? t('Reply')+" : " : ''} </strong>
                            <u>{value.subject}</u>
                          </p>
                          <span style={{textAlign:"right", float:"right"}} className="label label-success">Conversation #{value.id}</span>
                          <div className="clearfix"></div>
                        </Link>
                      ))}              
                    </div>
                  </div>
                </div>
              </div>
            
              <div className="col-md-8 message-sideright">
                <div className="panel">
                  <div className="panel-heading">
                    <div className="media">
                    
                      <a style={{alignContent:"left",float:"left"}} href="#">
                        <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiAvatar-fallback css-10mi8st-MuiSvgIcon-root-MuiAvatar-fallback" width="40px" height="40px" fill="#fff" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="PersonIcon"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
                      </a>
                      <div className="media-body">
                        <h4 className="media-heading">{activeMail.recipient_nick_name.toUpperCase()} <small>({t('Role').toLowerCase()}: {activeMail.recipient_role})</small></h4>
                        <small>{activeMail?.created_at?.split('.000Z')[0].replace('T', ' ')}</small>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 panel-body">
                    <p className="lead">
                      {activeMail.thread_id !=null ? t('Reply')+" : " : ''}
                      {activeMail.subject}
                    </p>
                    <hr />
                    <p>
                      {activeMail.message}
                    </p>
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </div> 

        </>
      )}
    </>
  )

}