import Link from "next/link"
import { AuthGaurd } from "./AuthGaurd"
import styles from "./HeaderUserInfo.module.scss"
import useTranslation from "next-translate/useTranslation"
import { useRouter } from "next/router"
import clsx from "clsx"
import { useGetUnreadCount } from "../hooks/useGetUnreadCount"
import { useSession } from "next-auth/react"
import { useEffect, useMemo } from "react"
import { useGetMe } from "../hooks/useGetMe"
import { useMediaQuery } from 'usehooks-ts'
import { useExchangePoint } from "../hooks/useExchangePoint"
import { Stack } from "@mui/material"
import { Button } from "../components/Button"

export const HeaderUserInfo = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { data:unread,refetch:unreadRepatch } = useGetUnreadCount();
  const { data:me,refetch } = useGetMe();
  const exchangePoint = useExchangePoint();
  const matchs = useMediaQuery('(max-width:640px)')
  const session = useSession();

  useEffect(()=>{
    if(session.status === 'authenticated') {
      refetch()
      unreadRepatch()
    }
  },[session.status])

  const openLoginPanel = useMemo(()=>{
    console.log(router.pathname,router.route)
    return matchs && !session.data && router.pathname.indexOf('sign')==-1
  }, [session.data,router,matchs])

  const inbox = useMemo(()=>{
    if(matchs) return <p><strong>{unread?.count ?? 0 }</strong> 통</p>
    return <p>
      쪽지: <strong>{unread?.count ?? 0 }</strong> 통
    </p>
  },[unread,matchs])

  const balance = useMemo(()=>{
    if(matchs) return <p><strong>{me?.balance?.toLocaleString() ?? 0}</strong> 원</p>
    return <p>
      보유머니: <strong>{me?.balance?.toLocaleString()}</strong> 원
    </p>
  },[me,matchs])

  const point = useMemo(()=>{
    if(matchs) return <p><strong>{me?.point?.toLocaleString() ?? 0}</strong> 원</p>
    return <p>
      포인트: <strong>{me?.point?.toLocaleString()}</strong> 원
    </p>
  },[me,matchs])

  const handleExchage = async () => {
    if(exchangePoint.status ==='loading') return;

    if(confirm('보유머니로 전환 하시겠습니까?')) {
      await exchangePoint.mutateAsync();
      refetch();
      alert('전환 완료')
    }
  }

  if(session.data?.user) return <div className={clsx('container',styles.HeaderUserInfo)}>
    <AuthGaurd>
      {(user)=><>
        {!matchs && <Link
          href={`/${router.locale}/profile`}
        >
          <div className={clsx('clickable',styles.Item)}>
            <p><strong>{user.nick_name}</strong>님</p>
          </div>
        </Link>}
        <Link locale={router.locale} href={'/inbox'}>
          <div className={clsx('clickable',styles.Item)}>
            <i className="icofont icofont-ui-message"/>
            {inbox}
          </div>   
        </Link>
        <Link locale={router.locale} href={'/deposit'}>
          <div className={clsx('clickable',styles.Item)}>
            <i className="icofont icofont-won"/>
            {balance}
          </div>   
        </Link>
        <Link locale={router.locale} href={'#'} onClick={handleExchage}>
          <div className={clsx('clickable',styles.Item)}>
            <i className="icofont icofont-peseta"/>
            {point}
          </div>   
        </Link>
      </>}
    </AuthGaurd>
  </div>

  if(openLoginPanel) return <div className={clsx('container',styles.HeaderUserInfo)}>
    <div className="d-flex flex-direction-center gap-2">
        <Link href="signin">
          <Button size="medium">로그인</Button>
        </Link>
        <Link href="signup">
          <Button size="medium">회원가입</Button>
        </Link>
      </div>
  </div>
  return <></>
}