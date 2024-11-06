import Header from '@/components/navbar/Header';
import MainNavbar from '@/components/navbar/MainNavbar';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={'flex justify-center p-4 lg:p-6 gap-x-7 min-h-screen bg-primary text-white'}>
      <MainNavbar />
      <main className={'grow min-w-0'}>
        <Header />
        <div className={'flex xl:gap-x-6'}>
          <div className={'grow min-w-0 xl:ml-[290px]'}>{children}</div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
