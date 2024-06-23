import { Chip } from "@mui/material"
import { TextInputProps } from "react-admin"



export const QuickFilter = (props: TextInputProps) => {
  return <Chip label={props.label} />
}