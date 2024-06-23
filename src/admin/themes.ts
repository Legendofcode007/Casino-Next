import { PaletteColorOptions } from '@mui/material';
import { green, } from '@mui/material/colors';
import { defaultTheme,defaultDarkTheme,defaultLightTheme,  RaThemeOptions } from 'react-admin';
import { alpha, getContrastRatio, } from '@mui/material/styles'
export type AdminTheme = RaThemeOptions & {
  palette: RaThemeOptions["palette"] & {
    third?: PaletteColorOptions
  }
};

const sidebar: RaThemeOptions["sidebar"] = {
  width: 200,
  closedWidth: 0,
}

export const lightTheme: AdminTheme = {
  ...defaultLightTheme,
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    third: {
      main: green[500],
      contrastText: '#fff'
    }
  },
  components: {
    ...defaultLightTheme.components,
  },
  sidebar
}

export const darkTheme: RaThemeOptions = {
  ...defaultDarkTheme,
  palette: {
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#FBBA72',
    },
    mode: 'dark' as 'dark', // Switching the dark mode on is a single property value change.
  },
  sidebar
};