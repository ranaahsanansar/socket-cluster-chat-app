import { DashboardIcon, UsersIcon } from '@/components/constants/Icons';

export const PUBLIC_ROUTES = ['/'];
export const PRIVATE_ROUTES = [
  {
    title: 'Home',
    path: '/home',
    icon: <DashboardIcon />,
  },
  {
    title: 'Logout',
    path: '/',
    icon: <UsersIcon />,
  },
];
