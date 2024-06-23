import useTranslation from "next-translate/useTranslation";
import styles from "./Hero.module.scss";
import { Link } from "react-router-dom";
import { useRouter } from "next/router";
import clsx from "clsx";
import { Typography } from "./Typography";


export type HeroProps = {
  children: React.ReactNode
}

export const Hero = ({children}:HeroProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  return  <section className={clsx("d-flex align-items-center",styles.Hero)}>
    <video className={styles.Video} autoPlay muted loop src="/videos/casino.mp4">
    </video>
    <div className={clsx("px-4 gap-2 container-lg",styles.Container)}>
      
      {/* <Typography variant="h1" animation isTitle>
        <Typography variant="span">Crown</Typography>
      </Typography> */}
      {/*<h2>{t('casino_&_slot')}</h2>*/}
      
    </div>
  </section>
}