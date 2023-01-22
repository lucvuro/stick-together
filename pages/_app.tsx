import '@/styles/globals.css';
import { getDesignTokens } from '@/theme';
import { createTheme, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/Contexts/authContext';
import { RoomProvider } from '@/Contexts/roomContext';
export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme(getDesignTokens('dark'));

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <RoomProvider>
          <Component {...pageProps} />
        </RoomProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
