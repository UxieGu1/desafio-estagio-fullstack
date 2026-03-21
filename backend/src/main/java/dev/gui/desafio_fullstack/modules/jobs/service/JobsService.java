package dev.gui.desafio_fullstack.modules.jobs.service;

import dev.gui.desafio_fullstack.modules.jobs.dto.JobsRequest;
import dev.gui.desafio_fullstack.modules.jobs.dto.JobsResponse;
import dev.gui.desafio_fullstack.modules.jobs.entity.Jobs;
import dev.gui.desafio_fullstack.modules.jobs.mapper.JobsMapper;
import dev.gui.desafio_fullstack.modules.jobs.repository.JobsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JobsService {

    private final JobsRepository jobsRepository;

    private final JobsMapper jobsMapper;


    @Transactional
    public JobsResponse createJob(JobsRequest jobsRequest){

        Jobs job = jobsMapper.toEntity(jobsRequest);
        Jobs savedJob = jobsRepository.save(job);
        return jobsMapper.toResponse(savedJob);
    }

    public Page<JobsResponse> listJobs(Pageable pageable) {

        Page<Jobs> vagasPage = jobsRepository.findAll(pageable);
        return vagasPage.map(jobsMapper::toResponse);
    }

    public JobsResponse findJobById(Long jobId) {

        Jobs job = jobsRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job posting not found with ID: " + jobId));
        return jobsMapper.toResponse(job);
    }

    @Transactional
    public JobsResponse updateJob(Long jobId, JobsRequest jobsRequest) {

        Jobs existingJob = jobsRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job posting not found with ID: " + jobId));

        existingJob.setTitle(jobsRequest.title());
        existingJob.setArea(jobsRequest.area());
        existingJob.setType(jobsRequest.type());

        Jobs updatedJob = jobsRepository.save(existingJob);

        return jobsMapper.toResponse(updatedJob);
    }

    @Transactional
    public void closeJob(Long jobId){

        Jobs job = jobsRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job posting not found with ID: " + jobId));

        jobsRepository.closeJobsById(jobId);
    }
}
