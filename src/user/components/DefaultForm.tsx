import { DetailedHTMLProps, FormEventHandler, FormHTMLAttributes } from "react"
import { Button } from "./Button";
import styles from "./DefaultForm.module.scss";
import clsx from "clsx";


export type DefaultFormProps = {
  onSubmit?: FormEventHandler<HTMLFormElement>;
  children?: React.ReactNode | React.ReactNode[],
  title?: string;
  submitTitle?: string;
} & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
export const DefaultForm = ({onSubmit,children,submitTitle,title,...props}: DefaultFormProps) => {
  return <section className={clsx("contact d-flex flex-column align-items-center container-sm",styles.DefaultFormWrap)}>
      <form onSubmit={onSubmit}  className={clsx(styles.DefaultForm,"d-flex flex-column gap-4")} {...props}>
        <div className="section-title2" style={{textAlign:"center", justifyContent:"center",justifyItems:"center"}}>
          <h2 style={{textAlign:"center", justifyContent:"center",justifyItems:"center"}}>{title}</h2>
        </div>
    
        <hr style={{ color: "white" }} className="m-0" />
        <div className={clsx(styles.Inbox)}>
          <img src="/images/logo.png" style={{width:"10rem"}} className="" />
        </div>
        <hr style={{ color: "white" }} className="m-0" />
        {children}


        <div className="d-flex flex-row justify-content-center">
          <Button size="large" type="submit" animation={true}>
            {submitTitle}
          </Button>
        </div>

        <hr style={{ color: "white" }} />
      </form>
  </section>
}