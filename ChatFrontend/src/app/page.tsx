'use client';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Image } from '@nextui-org/image';
import React from 'react';
import { createAccount, userLogin } from './actions';
import { TOKEN_KEY } from '@/constants/constants';
import { useRouter } from 'next/navigation';
import { useDisclosure, user } from '@nextui-org/react';
import AlertError from '@/components/modal/AlertError';
import AlertSuccess from '@/components/modal/AlertSuccess';

export default function Home() {
  const date = new Date();
  const year = date.getFullYear();
  const router = useRouter();
  const [isLoginLoading, setIsLoginLoading] = React.useState(false);
  const [isSingUpMode, setIsSingUpMode] = React.useState(false);

  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const [toastMessage, setToastMessage] = React.useState<string>('');

  const {
    isOpen: isErrorOpen,
    onOpen: onErrorOpen,
    onClose: onErrorClose,
    onOpenChange: onErrorOpenChange,
  } = useDisclosure();

  const {
    isOpen: isSuccessOpen,
    onOpen: onSuccessOpen,
    onClose: onSuccessClose,
    onOpenChange: onSuccessOpenChange,
  } = useDisclosure();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.name) {
      case 'email':
        setEmail(event.target.value);
        break;
      case 'password':
        setPassword(event.target.value);
        break;
      case 'username':
        setUsername(event.target.value);
        break;
      case 'confirmPassword':
        setConfirmPassword(event.target.value);
        break;
      default:
        break;
    }
  };
  const handleLogin = async () => {
    setIsLoginLoading(true);
    if (!username || !password) {
      setToastMessage('Please enter username and password');
      onErrorOpen();
      setIsLoginLoading(false);
      return;
    }
    await userLogin(username, password)
      .then((data) => {
        console.log('Token Response', data);
        localStorage.setItem(TOKEN_KEY, data.data.access_token);
        router.push('/home');
      })
      .catch((e) => {
        setToastMessage(e.message);
        onErrorOpen();
      });
    setIsLoginLoading(false);
  };

  const handleSingUp = async () => {
    setIsLoginLoading(true);
    if (!username || !email || !password || !confirmPassword) {
      setToastMessage('All fields are required');
      onErrorOpen();
      setIsLoginLoading(false);
      return;
    }
    await createAccount(username, password, email, confirmPassword)
      .then(() => {
        setToastMessage('Account created successfully, Please login');
        onSuccessOpen();
        setIsLoginLoading(false);
        setIsSingUpMode(false);
        return;
      })
      .catch((e) => {
        setToastMessage(e.message);
        onErrorOpen();
      });
    setIsLoginLoading(false);
  };

  return (
    <main className='grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-primary'>
      <div className='w-full h-screen hidden lg:block'>
        <AlertError isOpen={isErrorOpen} onOpenChange={onErrorOpenChange} message={toastMessage} />
        <AlertSuccess isOpen={isSuccessOpen} onOpenChange={onSuccessOpenChange} message={toastMessage} />

        <Image
          src='/images/login-page-image.png'
          classNames={{
            img: 'w-full h-full rounded-none object-cover',
          }}
          removeWrapper={true}
        />
      </div>
      <div className='h-full w-full flex items-center justify-center py-[56px] px-6 sm:px-10'>
        <div className='max-w-[566px] w-full h-full flex flex-col justify-between'>
          <div className='flex flex-col gap-6 h-full justify-center'>
            <div>
              <Image
                src='/images/AhsanLogoPNGLogo.png'
                classNames={{
                  img: 'rounded-none',
                }}
                removeWrapper={true}
              />
            </div>
            {isSingUpMode ? (
              <h1 className='text-white font-semibold text-[24px] sm:text-[32px]'>Create an Account</h1>
            ) : (
              <h1 className='text-white font-semibold text-[24px] sm:text-[32px]'>Sign in with credentials</h1>
            )}
            <p className='text-textColor text-[13px] sm:text-[16px] font-normal'>TODO: Chat Application</p>
            <div className='flex flex-col gap-6 mt-4'>
              <Input label='Username' name='username' placeholder='Username' onChange={handleChange} />
              {isSingUpMode && (
                <Input label='Email' name='email' placeholder='Email' type='email' onChange={handleChange} />
              )}

              <Input label='Password' name='password' placeholder='Password' type='password' onChange={handleChange} />
              {isSingUpMode && (
                <Input
                  label='Confirm Password'
                  name='confirmPassword'
                  placeholder='Confirm Password'
                  type='password'
                  onChange={handleChange}
                />
              )}

              {isSingUpMode ? (
                <Button isLoading={isLoginLoading} className='w-[139px] h-[48px]' onClick={handleSingUp}>
                  Sing Up
                </Button>
              ) : (
                <Button isLoading={isLoginLoading} className='w-[139px] h-[48px]' onClick={handleLogin}>
                  Login
                </Button>
              )}

              {isSingUpMode ? (
                <p className='text-textColor text-[13px] sm:text-[16px] font-normal'>
                  Already have an account?{' '}
                  <span
                    className='text-blue-600 cursor-pointer underline'
                    onClick={() => {
                      setIsSingUpMode(false);
                      console.log('Hit');
                    }}
                  >
                    Login
                  </span>
                </p>
              ) : (
                <p className='text-textColor text-[13px] sm:text-[16px] font-normal'>
                  Do not have an account?{' '}
                  <span
                    className='text-blue-600 cursor-pointer underline'
                    onClick={() => {
                      setIsSingUpMode(true);
                      console.log('Hit', isSingUpMode);
                    }}
                  >
                    Sing Up
                  </span>
                </p>
              )}
            </div>
          </div>
          <p className='text-[14px] font-light text-textColor'>© {year} Go Chat. All rights reserved By Ahsan.</p>
        </div>
      </div>
    </main>
  );
}
