import httpClient from '../api/httpClient';

export async function getPublicProfile(id: string) {
  const res = await httpClient.get(`/companies/${id}`);
  return res.data;
}

export async function getMyProfile() {
  const res = await httpClient.get('/companies/me');
  return res.data;
}

export async function updateMyProfile(data: Record<string, any>) {
  const res = await httpClient.put('/companies/me', data);
  return res.data;
}
