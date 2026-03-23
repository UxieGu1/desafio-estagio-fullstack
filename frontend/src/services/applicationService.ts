import { api } from '../api/api';
import type { ApplicationResponse } from '../types';


export interface ApplicationRequest {
  jobId: number;
  candidateName: string;
  email: string;
}

export const listApplicationsByJob = async (jobId: number): Promise<ApplicationResponse[]> => {
  const response = await api.get(`/api/applications/jobs/${jobId}`);
  return response.data;
};


export const createApplication = async (request: ApplicationRequest): Promise<ApplicationResponse> => {
  const response = await api.post('/api/applications', request);
  return response.data;
};


export const getApplicationById = async (id: number): Promise<ApplicationResponse> => {
  const response = await api.get(`/api/applications/${id}`);
  return response.data;
};


export const updateApplication = async (id: number, request: ApplicationRequest): Promise<ApplicationResponse> => {
  const response = await api.put(`/api/applications/${id}`, request);
  return response.data;
};


export const updateApplicationStatus = async (id: number, newStatus: string): Promise<ApplicationResponse> => {
  const response = await api.put(`/api/applications/${id}/status`, { status: newStatus });
  return response.data;
};


export const deleteApplication = async (id: number): Promise<void> => {
  await api.delete(`/api/applications/${id}`);
};