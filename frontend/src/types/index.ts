export type TypeEnum = 'INTERNSHIP' | 'JUNIOR' | 'MID_LEVEL' | 'SENIOR';

export type JobStatusEnum = 'OPEN' | 'CLOSED';

export type ApplicationStatusEnum = 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'; 


export interface JobResponse {
  id: number;
  title: string;
  area: string;
  type: TypeEnum;
  status: JobStatusEnum;
}

export interface ApplicationResponse {
  id: number;
  jobId: number;
  candidateName: string;
  email: string; 
  status: ApplicationStatusEnum;
}


export interface Page<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export type Jobs = JobResponse;
export type Application = ApplicationResponse;