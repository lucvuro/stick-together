import {
  Alert,
  AlertTitle,
  Box,
  Button,
  InputAdornment,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import styles from '@/styles/Login.module.css';
import { useForm, Controller } from 'react-hook-form';
import { auth } from '@/firebase';
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { LoadingButton } from '@mui/lab';
import { getErrorFirebase } from '@/utils/getErrorFisebase';
import useDatabase from '@/hooks/useDatabase';
interface RegisterFormProps {}
interface FormData {
  email: string;
  password: string;
  confirm_password: string;
}
const RegisterForm: React.FunctionComponent<RegisterFormProps> = (props) => {
  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirm_password: '',
    },
  });
  const [errorRegister, setErrorRegister] = useState<boolean>(false);
  const [errorRegisterMessage, setErrorRegisterMessage] = useState<string>('');
  const [successRegister, setSuccessRegister] = useState<boolean>(false);
  const { addUser } = useDatabase();
  const onSubmit = async (formData: FormData) => {
    setErrorRegister(false);
    setSuccessRegister(false);
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
      await addUser(userCredential);
      setSuccessRegister(true);
      reset();
    } catch (err: any) {
      setErrorRegister(true);
      const errorMessage: string = getErrorFirebase(err);
      setErrorRegisterMessage(errorMessage);
      console.log(err);
    }
  };
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {errorRegister && (
          <Alert severity="error">
            <AlertTitle>{errorRegisterMessage}</AlertTitle>
          </Alert>
        )}
        {successRegister && (
          <Alert severity="success">
            <AlertTitle>Successfully Sign Up!</AlertTitle>
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
                    error={!!errors['email'] || errorRegister}
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
              rules={{
                required: '*Password is required',
                validate: (value: string) => {
                  if (value.length <= 5) {
                    return 'Password is weak. At least 6 characters';
                  }
                },
              }}
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
          <Box>
            <Controller
              name="confirm_password"
              control={control}
              rules={{
                validate: (value: string) => {
                  if (watch('password') != value) {
                    return '*Confirm Password not match';
                  }
                },
              }}
              render={({ field: { onChange, value } }) => {
                return (
                  <TextField
                    id="confirm-password"
                    placeholder="Confirm Password"
                    type="password"
                    value={value}
                    onChange={onChange}
                    error={!!errors['confirm_password']}
                    helperText={
                      !!errors['confirm_password']
                        ? errors['confirm_password'].message?.toString()
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
              Sign Up
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default RegisterForm;
