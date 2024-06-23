import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getAllNotice } from "../../database/notice_board";
import useTranslation from 'next-translate/useTranslation';

const Home: NextPage = (props:any) => {

  const { t } = useTranslation('common')

  const [notice, setNotice] = useState(props.notice);

  useEffect(() => {

    
  })

  

 

  
  return (

    <>
   

      {notice.length > 0 && (
        <>
        

          <section id="contact" className="contact" style={{padding:"30px 0px"}}>
            <div className="container aos-init aos-animate" data-aos="fade-up">
              <div className="section-title2" style={{textAlign:"left", justifyContent:"left",justifyItems:"left", marginBottom:"5px"}}>
                <h2 style={{textAlign:"left", justifyContent:"left",justifyItems:"left"}}>{t('Notice_Board')}</h2>
              </div>

              <div style={{borderRadius:"0px", boxShadow: "0 0 10px rgba(214, 215, 216, 0.3)"}} className="accordion" data-bs-theme="dark" id="accordionExample">
  
              
                {notice.length > 0 && (
                  <>
                    {notice.map((value, index) => (    
              
                      <div key={index} className="accordion-item">
                        <h2 className="accordion-header" style={{color:"white",backgroundColor:"#191919"}} id="headingOne">
                          <button style={{ color: "white", backgroundColor: "#191919", fontSize:"16px", fontWeight:"500" }} className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#Collapse${value.id}`} aria-expanded="true" aria-controls={`#Collapse${value.id}`} >
                            {value.subject} #{value.id}
                          </button>
                        </h2>
                        <div id={`Collapse${value.id}`}  className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                          <div className="accordion-body">
      
                    

                            <div className="inbox-message">
                              <ul>
                        
                        
                                <li>
                                  <a href="#"><div className="message-avatar"> <img src="/images/item3.png" alt="" /></div><div className="message-body"><div className="message-body-heading"><h5 > <span className="unread">{t('Admin')}</span></h5> <span>{value?.created_at?.split('T')[0]}</span></div><p style={{color:"white"}}>{value.message}</p></div> </a>
                                </li>
                              </ul></div>


                          </div>
                        </div>
                      </div>

              

                    ))}
                  </>
                )}

 
              </div>
        



            </div>
          </section>

        </>
      )}
    </>
  )

  
};

export const getServerSideProps: GetServerSideProps = async (context) => {

  const session = await getSession(context);
    
  if (!session) return {
    redirect: {
      
      destination: "/" + context.locale + "/signin",
      permanent: false
    }
  };

  let user = null;
  user = session.user;
  
  let notice = await getAllNotice();

  //console.log(JSON.stringify(notice))
    
  return { props: {user: JSON.parse(JSON.stringify(user)),notice: JSON.parse(JSON.stringify(notice))} }
    
};

export default Home;
