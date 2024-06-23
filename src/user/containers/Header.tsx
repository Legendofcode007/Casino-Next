import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
//import MobileMenu from "./ui/mobile-menu";
import { useState, useEffect } from "react";
import { setCookies, hasCookie, getCookie } from 'cookies-next';
import useTranslation from 'next-translate/useTranslation';
import setLanguage from 'next-translate/setLanguage';
import { AuthGaurd } from "./AuthGaurd";
import styles from  "./Header.module.scss"
import { HeaderUserInfo } from "./HeaderUserInfo"
import { clsx } from "clsx"
const Header = () => {

  const { t } = useTranslation('common');
  const router = useRouter();

  const [ref, setRef] = useState(router.query.ref);
  const [domLoaded, setDomLoaded] = useState(false)
  const {data:session} = useSession();


  useEffect(() => {

    setDomLoaded(true)
    
  },[ref]);

  const handleSignout = (e:any) => {
    e.preventDefault();
    signOut();
  };

  const openMenu = () => {

    if (document.querySelector('#navbar')?.classList.contains('navbar-mobile')) {
    
      document.querySelector('#navbar')?.classList.remove('navbar-mobile')
      document.querySelector('.mobile-nav-toggle')?.classList.add('bi-list')
      document.querySelector('.mobile-nav-toggle')?.classList.remove('bi-x')
      
    }
    else {
      document.querySelector('#navbar')?.classList.add('navbar-mobile')
      document.querySelector('.mobile-nav-toggle')?.classList.remove('bi-list')
      document.querySelector('.mobile-nav-toggle')?.classList.add('bi-x')
    }

  }

  const closeMenu = () => {

    document.querySelector('#navbar')?.classList?.remove('navbar-mobile')
    document.querySelector('.mobile-nav-toggle')?.classList.add('bi-list')
    document.querySelector('.mobile-nav-toggle')?.classList.remove('bi-x')

  }

  const toggleSubMenu = (e:any) => {

    e.preventDefault();

    let Id = e.currentTarget.dataset.id;

    var elem = document.getElementById(Id);
    if(elem) {
      elem.style.display = elem.style.display === 'none' ? 'block' : 'none';
    }
  

  }

  

  return (
    <>
      <link href="/css/style.css" rel="stylesheet" />
      <div className={styles.AppBar}>
        <HeaderUserInfo/>
        <header className={clsx(styles.Header,"d-flex align-items-center")}>
          <div className="container d-flex align-items-center justify-content-between">

            <Link href={`/${router.locale}`}><img src="/images/logo.png" className={styles.Logo} /></Link>

            <nav id="navbar" className="navbar">
              <ul>
                <AuthGaurd>
                  {(user)=><>
                    {user.approved && (
                      <>
                        <li><Link onClick={closeMenu} className="nav-link scrollto" href={`/${router.locale}/vendors/casino`}>{t('LIVE_CASINO')}</Link></li>
                        <li><Link onClick={closeMenu} className="nav-link scrollto" href={`/${router.locale}/vendors/slot`}>{t('SLOT_GAMES')}</Link></li>
      
                        <li><Link onClick={closeMenu} href={`/${router.locale}/deposit`}>{t('Deposit')}</Link></li>
                        <li><Link onClick={closeMenu} href={`/${router.locale}/withdraw`}>{t('Withdraw')}</Link></li>
                        <li><Link onClick={closeMenu} href={`/${router.locale}/histories`}>배팅내역</Link></li>
                        <li><Link onClick={closeMenu} href={`/${router.locale}/cs`}>고객센터</Link></li>

                        {/* <li className="dropdown">
                          <Link data-id="messages-menu" onClick={toggleSubMenu} href="#"><span>{t('Messages')}</span><i className="bi bi-chevron-down"></i></Link>
                          <ul id="messages-menu">
                            <li><Link onClick={closeMenu} href={`/${router.locale}/inbox`}>{`${t('Inbox')}(${unread?.count ?? 0})`} </Link></li>
                            <li><Link onClick={closeMenu} href={`/${router.locale}/sent`}>{t('Sent')}</Link></li>
                            <li><Link onClick={closeMenu} href={`/${router.locale}/compose`}>{t('Compose')}</Link></li>
                          </ul>
                        </li> */}

                        <li className="dropdown">
                          <Link data-id="account-menu" onClick={toggleSubMenu} href="#"><span>{t('My_Account')}</span><i className="bi bi-chevron-down"></i></Link>
                          <ul id="account-menu">
                            <li><Link onClick={closeMenu} href={`/${router.locale}/profile`}>{t('Profile_Settings')}</Link></li>
                            <li><Link onClick={closeMenu} href={`/${router.locale}/bank`}>{t('Bank_Information')}</Link></li>
                          </ul>
                        </li>

                      </>
                    )}
                  </>}
                </AuthGaurd>
                
                

                {!session && (
                  <>
                    {domLoaded && (
                      <>  
                        <li className="dropdown">
                          <Link className="" onClick={closeMenu}
                            href={`/${router.locale}/signin`}>
                            {t('Sign_In')}
                          </Link>
                        </li>

                          <li className="dropdown">
                            <Link className="" onClick={closeMenu} href={`/${router.locale}/signup`}>
                              {t('Sign_Up')}
                            </Link>
                          </li>

                      </>
                    )}
                  </>
                )} 

                <AuthGaurd>
                    {(user)=><>
                      {user.role != "user" && (<li className="dropdown">
                          <Link onClick={closeMenu} href={`/${router.locale}/admin#/users`}>
                            {t('Admin')}
                          </Link>
                        </li>
                      )}
                      
                      <li className="dropdown">
                        <Link
                          onClick={handleSignout}
                          href="#"
                        >
                          {t('Logout')}
                        </Link>
                      </li>
                    </>}
                  </AuthGaurd>
              </ul>
              <i onClick={openMenu} className="bi bi-list mobile-nav-toggle"></i>
            </nav>
          </div>
      </header>
      <div className={clsx("container py-1",styles.MobileNickName)}>
        <AuthGaurd >
          {(user)=><p style={{color:'#fff'}} className="m-0"><strong>{user.nick_name}</strong>님</p>}
        </AuthGaurd>
      </div>
    </div>
  </>
  );
};

export default Header;