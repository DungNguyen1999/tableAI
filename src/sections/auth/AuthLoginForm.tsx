import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { PostLogin } from 'src/Apis/Api';

import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';
// import { PATH_DASHBOARD } from 'src/routes/paths';
import { useAuthContext } from '../../auth/useAuthContext';
// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
  afterSubmit?: string;
};

export default function AuthLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });
  const { login } = useAuthContext();
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    // try {
    //   const res = await PostLogin(data);
    //   if (res?.status === 200) {
    //     console.log('==s', data);
    //     localStorage.setItem('token', res?.data?.token);
    //     replace('/dashboard');
    //   }
    // } catch (error) {
    //   reset();
    //   setError('afterSubmit', {
    //     ...error,
    //     message: error.message,
    //     error,
    //   });
    // }
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error(error);

      reset();

      setError('afterSubmit', {
        ...error,
        message: error.message || error,
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email address" />
        <div>cocoadminai@cocogame.vip</div>

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <div> VH4Vv8PCcMCK</div>
      <Stack alignItems="flex-end" sx={{ my: 2 }}>
        <Link variant="body2" color="inherit" underline="always">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitSuccessful || isSubmitting}
        sx={{
          bgcolor: 'text.primary',
          color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          '&:hover': {
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          },
        }}
      >
        Login
      </LoadingButton>
    </FormProvider>
  );
}
