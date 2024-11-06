'use client';
import React, { useState } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Image } from '@nextui-org/react';
import Link from 'next/link';
import { navbarClass, NavBtnSvg1, NavBtnSvg2 } from './const';
import Button from '../Button';
import { isPathName } from '@/utils/utils';
import { usePathname } from 'next/navigation';
import { PRIVATE_ROUTES } from '@/constants/routes';

const MainNavbar = () => {
  const [isBoxVisible, setBoxVisibility] = useState(false);
  const pathname = usePathname();

  const handleButtonClick = () => {
    setBoxVisibility(!isBoxVisible);
  };

  return (
    <>
      <Navbar
        position='sticky'
        isBlurred={false}
        isBordered={false}
        height={'full'}
        className={`${
          isBoxVisible ? 'ml-0 bg-primary !max-w-[300px] p-4' : '-ml-[230px]'
        } w-full hidden bg-primary xl:block transition-all duration-150 max-w-[230px] xl:max-w-[230px] fixed left-6 top-6 bottom-4 xl:ml-0`}
        classNames={navbarClass}
      >
        <NavbarBrand className={'grow-0 mb-4'}>
          <Link href={'/dashboard'}>
            <Image removeWrapper={true} src='/images/AhsanLogoPNGLogo.png' alt='Logo' />
          </Link>
        </NavbarBrand>
        <NavbarContent justify={'start'}>
          {isBoxVisible ? (
            <Button
              onClick={handleButtonClick}
              className={
                'bg-secondary-50 sm:border-1 border-secondary-100 sm:border-l-0 min-w-fit xl:hidden absolute right-0 top-0 h-auto p-0 sm:p-2'
              }
            >
              <NavBtnSvg1 />
            </Button>
          ) : (
            <Button
              onClick={handleButtonClick}
              className={
                'bg-secondary-50 border-1 border-secondary-100 border-l-0 min-w-fit xl:hidden fixed left-6 top-6'
              }
            >
              <NavBtnSvg2 />
            </Button>
          )}

          {PRIVATE_ROUTES?.map((route: any) => {
            return (
              <NavbarItem key={route.path} isActive={isPathName(pathname, route?.path)}>
                <Link className='py-3 px-3 flex items-center gap-2 text-[16px]' href={route.path} aria-current='page'>
                  {route?.icon}
                  {route?.title}
                </Link>
              </NavbarItem>
            );
          })}
        </NavbarContent>
      </Navbar>
    </>
  );
};

export default MainNavbar;
