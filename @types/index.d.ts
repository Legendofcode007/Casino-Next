import { PaletteColor, PaletteColorOptions } from "@mui/material"
import { AuthenticatedUser } from "../dto/AuthenticatedUserDto"


declare module '@mui/material/styles' {
  interface Theme {
    pallete? : Palette & {
      third?: PaletteColor
    }
  }

  interface ThemeOptions {
    pallete? :  {
      third?: PaletteColorOptions
    }
  }

  interface Palette {
    third: PaletteColor
  }
}


declare module 'ra-ui-materialui' {
  interface RathemeOptions {
    pallete? : {
      third?: PaletteColorOptions
    }
  }
}

declare module 'next-auth' {
  interface Session {
    user?: AuthenticatedUser
  }
}