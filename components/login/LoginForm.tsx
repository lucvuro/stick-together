import { Box, Button, InputAdornment, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import styles from '@/styles/Login.module.css';
import { useForm, Controller } from 'react-hook-form';
interface LoginFormProps {}

const LoginForm: React.FunctionComponent<LoginFormProps> = (props) => {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' } });
  const onSubmit = (formData: any) => {
    alert(JSON.stringify(formData));
  };
  return (
    <>
      <Box>
        <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Controller
              name="email"
              control={control}
              rules={{ required: '*Email is required' }}
              render={({ field: { onChange, value } }) => {
                return (
                  <TextField
                    id="email"
                    placeholder="Email"
                    value={value}
                    onChange={onChange}
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
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default LoginForm;
