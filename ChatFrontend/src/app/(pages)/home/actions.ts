import { apiRoutes } from '@/constants/apiRoutes';
import { GroupCardResponse } from '@/constants/types';
import { baseUrl } from '@/constants/urls';
import { getCall, postCall } from '@/utils/apiCalls';

export const getAllGroupsCards = async (token: string | null): Promise<GroupCardResponse[]> => {
  const url = `${baseUrl}${apiRoutes.getAllGroups}`;
  const data = await getCall(url, token);
  return data.data.groups;
};

export const searchGroups = async (keyword: string): Promise<GroupCardResponse[]> => {
  const url = `${baseUrl}${apiRoutes.searchGroups}?keyword=${keyword}`;
  const data = await getCall(url);
  return data.data.groups;
};

export const crateGroup = async (postData: any, token: string | null) => {
  const url = `${baseUrl}${apiRoutes.crateGroup}`;
  const data = await postCall(url, postData, token);
  return data;
};

export const deleteGroup = async (id: string, token: string | null) => {
  const url = `${baseUrl}${apiRoutes.deleteGroup}/${id}`;
  const data = await getCall(url, token);
  return data;
};
