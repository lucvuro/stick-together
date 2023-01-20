import '@/styles/globals.css'
import { getDesignTokens } from '@/theme'
import { createTheme, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme(getDesignTokens('dark'))
  return <ThemeProvider theme={theme}><Component {...pageProps} /></ThemeProvider>
}
