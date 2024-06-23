import { useCallback, useState } from "react";
import { Typography } from "./Typography";
import { Button } from "./Button";


export type MoneyInputGroupProps = {
  moneies: number[];
}

export const MoneyInputGroup = (props:MoneyInputGroupProps) => {
  const [money,setMoney] = useState(0);

  const onClick = useCallback((m:number)=>{
    setMoney((money)=>money+m)
  },[money])
  return <div className="d-flex flex-column">
     <div style={{width: "100%"}} className="form-group pb-2">
        <label className="form-label"></label>

        <div className="d-flex flex-row gap-2">
          <input
            name='amount'
            type="text"
            className="form-control"
            value={money}
            readOnly            
            pattern="[0-9]+"
          />
          <Button size="medium" type="button" onClick={()=>setMoney(0)}>Clear</Button>  
        </div>
        
        <Typography variant="span" style={{color:"#fff",fontSize:'1rem'}} >{money.toLocaleString()} 원</Typography>
      </div>
      <div  className="d-inline-flex flex-row flex-wrap gap-1">
          {props.moneies.map((v)=> {
            return <button 
              key={v}
              onClick={()=>onClick(v)} 
              type="button" className="btn btn-primary"
            >{v.toLocaleString()} 원</button>
          })}
      </div>
  </div>
}