import { Grid2Props } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"



export type SimpleTableProps = {
} & Grid2Props
export const SimpleTable = ({children,sx,...props}:SimpleTableProps) => {
  return <Grid2
    container
    spacing={2}
    sx={{
      '--Grid-borderWidth': '1px',
      borderTop: 'var(--Grid-borderWidth) solid',
      borderLeft: 'var(--Grid-borderWidth) solid',
      borderColor: 'divider',
      '& > div': {
        borderRight: 'var(--Grid-borderWidth) solid',
        borderBottom: 'var(--Grid-borderWidth) solid',
        borderColor: 'divider',
      },
      width: 400,
      ...sx,
    }}
    {...props}
  >
    {children}
  </Grid2>
}