import httpClient from '../api/httpClient';

export async function getProfile() {
  const res = await httpClient.get('/students/me');
  return res.data;
}

export async function updateProfile(data: Record<string, any>) {
  const res = await httpClient.put('/students/me', data);
  return res.data;
}

export async function extractOnboardingProfile(file: File) {
  const form = new FormData();
  form.append('pdf', file);
  const res = await httpClient.post('/ai/extract-onboarding-profile', form);
  return res.data;
}
