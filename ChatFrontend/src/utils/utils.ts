import { PAGE_LIMIT, TOKEN_KEY } from '@/constants/constants';

export const isPathName = (currentPath: string, givenPath: string) => {
  if (currentPath === givenPath) return true;
  else false;
};

export const getOffSet = (pageNo: number) => {
  return (pageNo - 1) * Number(PAGE_LIMIT);
};

export const countTotalPages = (page: number, limit: number, totalCount: number): number => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const total = totalCount;
  return Math.ceil(total / limit);
};
