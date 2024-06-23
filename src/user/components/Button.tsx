import { ButtonHTMLAttributes, DetailedHTMLProps, useMemo } from "react";
import styles from "./Buttom.module.scss";
import clsx from "clsx";



export type ButtonProps = {
  size: 'small' | 'medium' | 'large'
  children: React.ReactNode,
  animation?: boolean,
  color?: 'success'
  
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>,HTMLButtonElement>

export const Button = ({size,children,className,color,...props}:ButtonProps) => {
  const sizeClass = useMemo(()=>{
    if(size =='large') return styles.Large;
    else if(size ==='small') return styles.Small;
    return styles.Medium
  },[size])
  return <button {...props} className={clsx("button",styles.Button,sizeClass,!!props.animation && styles.Animation, color === 'success' && styles.SuccessColor)}>
    <div className={styles.Border}>

    </div>
    <div className={styles.Fill}>

    </div>
    <span>
      {children}
    </span>
  </button>
}