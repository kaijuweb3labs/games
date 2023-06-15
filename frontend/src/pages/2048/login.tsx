import { signInUser } from '@/redux/slices/user';
import { AppDispatch } from '@/redux/store';
import { useRouter } from 'next/router';
import React from 'react'
import { useDispatch } from 'react-redux';

const Login: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const successfulSignIn = () => {
    dispatch(signInUser());
  };
  return (
    <div className='h-screen w-screen flex flex-col md:justify-center items-center'>
      <div
        className='w-full md:w-2/3 lg:w-1/2 md:border-[2px] md:border-[#1C1D29]/80 flex flex-row
        p-[12px] md:p-[38px] rounded-[20px] space-x-[40px]'
      >
        <div className='flex flex-3 flex-col justify-center items-center'>
          <div className='md:hidden w-full flex-2 bg-[#2F3146] rounded-[20px]'>
            <img src='/kaiju.svg' alt='Kaiju' className='w-full h-full' />
          </div>
          <h1 className='text-[20px] mt-[24px] md:mt-0 font-bold text-white'>
            Please log in to Play the Game
          </h1>
          <button
            className='bg-[#1C1D29] w-full flex flex-row items-center justify-center
            p-[14px] rounded-[16px] mt-[24px] px-[72px] hover:bg-[#2F3146] transition duration-300'
            onClick={successfulSignIn}
          >
            <img src='/google.svg' alt='Google' className='w-[24px] h-[24px]' />
            <h3 className='text-[16px] font-bold text-white ml-[5px]'>
              Continue with Google
            </h3>
          </button>
        </div>
        <div className='hidden md:inline-block flex-2 bg-[#2F3146] rounded-[20px]'>
          <img src='/kaiju.svg' alt='Kaiju' className='w-full h-full' />
        </div>
      </div>
    </div>
  );
};

export default Login;