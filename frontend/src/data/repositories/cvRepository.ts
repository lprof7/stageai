import httpClient from '../api/httpClient';
import type { Cv } from '../models';

export async function listCvs(): Promise<Cv[]> {
  const res = await httpClient.get('/cvs');
  return res.data;
}

export async function createCv(name: string, file: File): Promise<Cv> {
  const form = new FormData();
  form.append('name', name);
  form.append('pdf', file);
  const res = await httpClient.post('/cvs', form);
  return res.data;
}

export async function getCv(id: string): Promise<Cv> {
  const res = await httpClient.get(`/cvs/${id}`);
  return res.data;
}

export async function updateCv(id: string, data: { name?: string; extractedSkills?: string[] }): Promise<Cv> {
  const res = await httpClient.put(`/cvs/${id}`, data);
  return res.data;
}

export async function reprocessCv(id: string): Promise<Cv> {
  const res = await httpClient.post(`/cvs/${id}/reprocess`);
  return res.data;
}

export async function deleteCv(id: string): Promise<void> {
  await httpClient.delete(`/cvs/${id}`);
}
