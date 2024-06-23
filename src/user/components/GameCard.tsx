import styles from "./GameCard.module.scss"
import { Typography } from "./Typography";


export type GameCardProps = {
  onClick?:()=>{};
  src?:string;
  buttonName?:string;
  title?: string;
}

export const GameCard = (props:GameCardProps) => {

  return  <div className="p-2 col-6 col-lg-2  d-flex align-items-stretch  m-0">
    <a  href="#" onClick={props.onClick}>
      <div className={styles.GameCard}>
        <div className={styles.Img}>
          <img className="img_rollover" style={{width:"100%"}} src={props.src} alt="" />
          <div className={styles.Social}>
            <button style={{padding:"5px 25px", borderRadius:"30px"}} type="button" className="btn btn-primary">{props.buttonName}</button>
          </div>
        </div>
      </div>
      <div className="d-flex flex-row justify-content-center">
        <Typography variant="span" style={{color:"#fff",textAlign:"center"}}>{props.title}</Typography>
      </div>
    </a>
  </div>
}