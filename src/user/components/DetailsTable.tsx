



export type DetailsTableProps = {
  items?: any[][];
  title?:string;
}

export const DetailesTable = (props:DetailsTableProps) => {
  return <div className="d-flex flex-column">
      {props.title}
      {props.items?.map((v,idx)=> {
        return <div key={idx} className="d-flex flex-row ">
          {v.map((v,idx)=>{
            return <div key={idx}>{v}</div>
          })}

        </div>
      })}
      
    </div>
}