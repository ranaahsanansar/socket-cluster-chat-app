'use client';
import React, { useState } from 'react';
import Button from '../Button';
import { Avatar } from '@nextui-org/react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from '@nextui-org/react';
import { CopyIcon, LogoutIcon, MenuIcon } from '../constants/Icons';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Image } from '@nextui-org/react';
import Link from 'next/link';
import { navbarClass, NavBtnSvg1, NavBtnSvg2 } from './const';
import { isPathName } from '@/utils/utils';
import { usePathname } from 'next/navigation';
import { PRIVATE_ROUTES } from '@/constants/routes';

const Header = () => {
  const [isBoxVisible, setBoxVisibility] = useState(false);
  const pathname = usePathname();

  const handleButtonClick = () => {
    setBoxVisibility(!isBoxVisible);
  };
  return (
    <>
      <div className='w-ful justify-between flex items-center'>
        <button className={'block xl:hidden'} onClick={handleButtonClick}>
          <MenuIcon />
        </button>
      </div>

      <Navbar
        position='sticky'
        isBlurred={false}
        isBordered={false}
        height={'full'}
        className={`${
          isBoxVisible ? 'translate-x-[0px] !max-w-[300px] p-4' : '-translate-x-[200px]'
        } w-full transition-transform bg-primary xl:hidden duration-100 max-w-[200px] xl:max-w-[200px] fixed left-0 top-0 bottom-0 xl:relative xl:ml-0`}
        classNames={navbarClass}
      >
        <NavbarBrand className={isBoxVisible ? 'grow-0 mb-4 mt-8' : 'grow-0 mb-4'}>
          <Link href={isBoxVisible ? '/home' : '/#'}>
            <Image removeWrapper={true} className='p-5' src='/images/AhsanLogoPNGLogo.png' alt='Logo' />
          </Link>
        </NavbarBrand>
        <NavbarContent className={'overflow-y-auto alinaeem'} justify={'start'}>
          {isBoxVisible ? (
            <Button
              onClick={handleButtonClick}
              className={'bg-transparent min-w-fit xl:hidden absolute right-0 top-0 h-auto p-0 sm:p-2'}
            >
              <NavBtnSvg1 />
            </Button>
          ) : (
            <Button onClick={handleButtonClick} className={'bg-transparent min-w-fit xl:hidden fixed left-6 top-6'}>
              <NavBtnSvg2 />
            </Button>
          )}

          {PRIVATE_ROUTES?.map((route: any, index: number) => {
            return (
              <NavbarItem key={index} isActive={isPathName(pathname, route?.path)}>
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

export default Header;
