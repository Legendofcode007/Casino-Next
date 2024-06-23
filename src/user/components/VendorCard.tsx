import { Typography } from "./Typography";
import styles from "./VendorCard.module.scss";



export type CasinoCardProps = {
  src?: string;
  logo_src?: string;
  title: string;
  subTitle: string;
  onClick: any
}
export const CasinoCard = (props:CasinoCardProps) => {
  return <a className={styles.CasinoCard} onClick={props.onClick}>
    <div className={styles.Border}/>
    <div className={styles.Fill}>
      <img className={styles.Background} src={props.src} />
      <img className={styles.Logo} src={props.logo_src}>

      </img>
      <div className={styles.Title}>
        {props.title}
        <div className={styles.SubTitle}>
          {props.subTitle}
        </div>
      </div>
    </div>
  </a>
}


export type SlotCardPorps = {
  logo_src?: string;
  title: string,
  onClick: any

}
export const SlotCard = (props:SlotCardPorps) => {
  
  return <div className={styles.SlotCard} onClick={props.onClick}>
    <div className={styles.Border}>

    </div>
    <div className={styles.Fill}>
      <div className={styles.LogoWrap}>
        <img src={props.logo_src} className={styles.Logo}/>
      </div>

      <div className={styles.Title}>
        <span>
          {props.title}
        </span>
      </div>
    </div>

  </div>
}

export type VnedorCardListProps = {
  children: React.ReactNode[]
}

export const CasinoCardList = (props:VnedorCardListProps) => {
  return <div className={styles.CasinoCardList}>
    {props.children}
  </div>
} 

export const SlotCardList = (props: VnedorCardListProps) => {
  return <div className={styles.SlotCardList}>
    {props.children}

  </div>
}