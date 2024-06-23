import DoneIcon from '@mui/icons-material/Done'
import ClearIcon from '@mui/icons-material/Clear'

export type BooleanIconProps = {
  bool: boolean
}

export const BooleanIcon = ({bool}:BooleanIconProps) => {
  return bool ? <DoneIcon color='success'/>:<ClearIcon color='error'/>
}