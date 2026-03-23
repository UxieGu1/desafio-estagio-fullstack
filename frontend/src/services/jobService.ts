import { api } from '../api/api';
import type { Page, Jobs } from '../types';


export const getJobs = async (page = 0, size = 10, title?: string): Promise<Page<Jobs>> => {
  const params: any = { page, size };
  
  if (title) {
    params.title = title;
  }

  const response = await api.get('/api/jobs', { params });
  return response.data;
};


export const getJobById = async (id: number): Promise<Jobs> => {
  const response = await api.get(`/api/jobs/${id}`);
  return response.data;
};


export const createJob = async (jobData: Omit<Jobs, 'id'>): Promise<Jobs> => {
  const response = await api.post('/api/jobs', jobData);
  return response.data;
};


export const getOpenJobsCount = async (): Promise<number> => {
  const response = await api.get('/api/jobs/dashboard/open-count');
  return response.data;
};


export const getDashboardStatusCount = async () => {
  const response = await api.get('/api/jobs/dashboard/status');
  return response.data;
};


export const getDashboardApplicationCount = async () => {
  const response = await api.get('/api/jobs/dashboard/applications-count');
  return response.data;
};


export const updateJob = async (id: number, jobData: Omit<Jobs, 'id'>): Promise<Jobs> => {
  const response = await api.put(`/api/jobs/${id}`, jobData);
  return response.data;
};


export const closeJob = async (id: number): Promise<void> => {
  await api.patch(`/api/jobs/${id}/close`);
};


export const deleteJob = async (id: number) => {
  await api.delete(`/api/jobs/${id}`);
};