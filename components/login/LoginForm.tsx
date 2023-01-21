import {
  Alert,
  AlertTitle,
  Box,
  Button,
  InputAdornment,
  TextField,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import styles from '@/styles/Login.module.css';
import { useForm, Controller } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import useAuth from '@/hooks/useAuth';
import { getErrorFirebase } from '@/utils/getErrorFisebase';
import { LoadingButton } from '@mui/lab';
interface LoginFormProps {}
interface FormData {
  email: string;
  password: string;
}
const LoginForm: React.FunctionComponent<LoginFormProps> = (props) => {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' } });
  const { auth } = useAuth();
  const onSubmit = async (formData: FormData) => {
    setErrorLogin(false);
    setSuccessLogin(false);
    try {
      const userCrential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      setSuccessLogin(true);
    } catch (err) {
      setErrorLogin(true);
      const errorText = getErrorFirebase(err);
      setErrorMessage(errorText);
      console.log(err);
    }
  };
  const [errorLogin, setErrorLogin] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successLogin, setSuccessLogin] = useState<boolean>(false);
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {errorLogin && (
          <Alert severity="error">
            <AlertTitle>{errorMessage}</AlertTitle>
          </Alert>
        )}
        {successLogin && (
          <Alert severity="success">
            <AlertTitle>Login successfully</AlertTitle>
          </Alert>
        )}
        <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Controller
              name="email"
              control={control}
              rules={{
                required: '*Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: '*Invalid email',
                },
              }}
              render={({ field: { onChange, value } }) => {
                return (
                  <TextField
                    id="email"
                    placeholder="Email"
                    value={value}
                    onChange={onChange}
                    disabled={isSubmitting}
                    error={!!errors['email']}
                    helperText={
                      !!errors['email']
                        ? errors['email'].message?.toString()
                        : ''
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                );
              }}
            />
          </Box>
          <Box>
            <Controller
              name="password"
              control={control}
              rules={{ required: '*Password is required' }}
              render={({ field: { onChange, value } }) => {
                return (
                  <TextField
                    id="password"
                    placeholder="Password"
                    type="password"
                    value={value}
                    onChange={onChange}
                    disabled={isSubmitting}
                    error={!!errors['password']}
                    helperText={
                      !!errors['password']
                        ? errors['password'].message?.toString()
                        : ''
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                );
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <LoadingButton
              loading={isSubmitting}
              type="submit"
              variant="contained"
              fullWidth
            >
              Login
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default LoginForm;
