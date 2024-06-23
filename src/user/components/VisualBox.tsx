import clsx from "clsx"
import styles from "./VisualBox.module.scss"
import { Typography } from "./Typography"
import { Button } from "./Button"

export type VisualBoxProps = {
  title: string;
  subTitle: string;
  src:string,
  children?: React.ReactNode,
  size?: 'large' | 'medium',
  className?: string
}

export const VisualBox = (props:VisualBoxProps) => {
  return <div className={clsx(styles.VisualBox,props.size ==='large' ? styles.Large:styles.Medium,props.className)}>
    <div className={clsx(styles.ImgBox)}>
      <img src={props.src}></img>
    </div>
    <div className={clsx('container-lg gap-2',styles.Container)}>
      <Typography variant="h1" isTitle >{props.title}</Typography>
      <Typography variant="h2" animation animationDuration="6s">{props.subTitle}</Typography>
      {props.children}
    </div>
  </div>
}