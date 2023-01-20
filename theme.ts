import { createTheme, PaletteMode } from '@mui/material'

export const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // palette values for light mode
            primary: {
                main: '#0c0c0c'
            },
            background: {
                default: '#f6f6f6'
            },
            text: {
              primary: '#0c0c0c',
            },
          }
        : {
            // palette values for light mode
            primary: {
                main: '#f6f6f6'
            },
            background: {
                default: '#0c0c0c'
            },
            text: {
              primary: '#f6f6f6',
            },
          }),
    },
  });