import { TOKEN_KEY } from '@/constants/constants';

const throwErrorMessage = async (response: any) => {
  const errorMessage: any = await response.json();

  throw new Error(errorMessage.message ? errorMessage.message : 'Something went wrong');
};

export const getCall = async (url: string, token?: string | null) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },

      cache: 'no-cache',
    });
    if (!response.ok || response.status !== 200) {
      return throwErrorMessage(response);
    }
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

export const postCall = async (url: string, data: any, token?: string | null) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    cache: 'no-cache',
  });

  if (!response.ok || (response.status !== 201 && response.status !== 200)) {
    console.log('Response : Not OK', !response.ok);
    return throwErrorMessage(response);
  }
  return response.json();
};

export const deleteCall = async (url: string, token?: string | null) => {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-cache',
  });

  if (!response.ok || response.status !== 200) {
    return throwErrorMessage(response);
  }
  return response.json();
};

export const postCallWithFormData = async (url: string, formData: FormData, token?: string | null) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      // 'Content-Type': 'multipart/form-data',
      // Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: formData,
    cache: 'no-cache',
  });

  if (!response.ok || response.status !== 201) {
    return throwErrorMessage(response);
  }
  return await response.json();
};
