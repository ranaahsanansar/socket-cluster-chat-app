import { apiRoutes } from '@/constants/apiRoutes';
import { GroupInfo } from '@/constants/types';
import { baseUrl } from '@/constants/urls';
import { getCall } from '@/utils/apiCalls';

export const getGroupInfo = async (id: string): Promise<GroupInfo> => {
  const url = `${baseUrl}${apiRoutes.getGroupInfo}/${id}`;
  const data = await getCall(url);
  return data.data.group;
};

export const addMember = async (id: string, username: string, token: string | null) => {
  const url = `${baseUrl}${apiRoutes.addMemberToGroup}/${id}/${username}`;
  const data = await getCall(url, token);
  return data;
};
