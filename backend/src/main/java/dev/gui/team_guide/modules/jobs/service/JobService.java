package dev.gui.team_guide.modules.jobs.service;

import dev.gui.team_guide.modules.jobs.dto.JobRequest;
import dev.gui.team_guide.modules.jobs.dto.JobResponse;
import dev.gui.team_guide.modules.jobs.entity.Job;
import dev.gui.team_guide.modules.jobs.mapper.JobMapper;
import dev.gui.team_guide.modules.jobs.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;

    private final JobMapper jobMapper;


    @Transactional
    public JobResponse createJob(JobRequest jobRequest){

        Job job = jobMapper.toEntity(jobRequest);
        Job savedJob = jobRepository.save(job);
        return jobMapper.toResponse(savedJob);
    }

    public Page<JobResponse> listJobs(int page, int size, String title) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Job> jobsPage;

        if (title != null && !title.trim().isEmpty()) {
            jobsPage = jobRepository.findByTitleContainingIgnoreCase(title, pageRequest);
        } else {
            jobsPage = jobRepository.findAll(pageRequest);
        }

        return jobsPage.map(jobMapper::toResponse);
    }

    public JobResponse findJobById(Long jobId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job posting not found with ID: " + jobId));
        return jobMapper.toResponse(job);
    }

    public Long countOpenJobs() {
        return jobRepository.countOpenJobs();
    }

    @Transactional
    public JobResponse updateJob(Long jobId, JobRequest jobRequest) {

        Job existingJob = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job posting not found with ID: " + jobId));

        existingJob.setTitle(jobRequest.title());
        existingJob.setArea(jobRequest.area());
        existingJob.setType(jobRequest.type());

        Job updatedJob = jobRepository.save(existingJob);

        return jobMapper.toResponse(updatedJob);
    }

    @Transactional
    public void closeJob(Long jobId){

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job posting not found with ID: " + jobId));

        jobRepository.closeJobsById(jobId);
    }
}
