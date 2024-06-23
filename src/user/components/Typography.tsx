import clsx from "clsx"
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode, createElement } from "react"
import styles from "./Typography.module.scss"

export type TypographyProps = {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span',
  animation?: boolean,
  animationDuration?: string,
  isTitle?: boolean, 
  children: ReactNode
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLParagraphElement>,HTMLParagraphElement>
export const Typography = ({variant='p',children,animation,isTitle,animationDuration, ...props}:TypographyProps ) => {
  return createElement(
    variant,
    {
      ...props,
      className: clsx(props.className, styles.Typography, animation && styles.Animation,isTitle && styles.Title),
      style: {
        animationDuration,
        ...props.style
      }
    },
    children
  )

}