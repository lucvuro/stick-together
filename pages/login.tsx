import Head from 'next/head';
import React, { useState, useEffect} from 'react';
import styles from '@/styles/Login.module.css';
import { Box } from '@mui/material';
import LoginForm from '@/components/login/LoginForm';
import RegisterForm from '@/components/login/RegisterForm';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from 'next/router';
export interface LoginPageProps {}

const Login = (props: LoginPageProps) => {
  const [loginShow, setLoginShow] = useState<boolean>(true);
  const router = useRouter()
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (router.pathname === '/login') {
          router.push('/');
        }
      } else {
        router.push('/login');
      }
    });
    return () => unsub();
  }, []);
  return (
    <>
      <Head>
        <title>Login | Stick Together</title>
        <meta name="description" content="Login Stick Together" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {<main className={styles.main}>
        <Box sx={{ color: 'text.primary' }}>
          {loginShow && (
            <>
              <Box>
                <LoginForm />
                <Box>
                  <p
                    className={styles.loginDescription}
                    style={{ marginTop: '2rem', textAlign: 'center' }}
                  >
                    {`Don't have account?`}{' '}
                    <span
                      onClick={() => setLoginShow(false)}
                      style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      Sign Up
                    </span>
                  </p>
                </Box>
              </Box>
            </>
          )}
          {!loginShow && (
            <>
              <Box>
                <RegisterForm />
              </Box>
              <Box>
                <p
                  className={styles.loginDescription}
                  style={{ marginTop: '2rem', textAlign: 'center' }}
                >
                  {`Already have account?`}{' '}
                  <span
                    onClick={() => setLoginShow(true)}
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Login
                  </span>
                </p>
              </Box>
            </>
          )}
        </Box>
      </main>}
    </>
  );
};
export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}
export default Login;
