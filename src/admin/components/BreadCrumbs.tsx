import { Breadcrumbs, Link, Typography } from "@mui/material"


type BreadCrumbsPropsItem = {
  name: string;
  link?: string;
}
export type BreadCrumbsProps = {
  items: BreadCrumbsPropsItem[]
}

export const BreadCrumbs = ({items = []}: BreadCrumbsProps) => {

  return <Breadcrumbs aria-label="breadcrumb"  sx={(theme)=>({
    py:2,
    width: theme.breakpoints.values.lg,
    margin: 'auto'
    })}>
    {items.map((item,idx)=>(
      item.link
        ? <Link variant="h6" key={idx} underline="hover" href={item.link}>{item.name}</Link>
        : <Typography variant="h6" key={idx} color="text.primary" sx={{opacity: items.length-1 === idx ? 1:0.7}} >{item.name}</Typography>
    ))}
 
  </Breadcrumbs>
}