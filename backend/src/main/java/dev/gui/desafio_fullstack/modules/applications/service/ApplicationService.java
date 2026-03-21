package dev.gui.desafio_fullstack.modules.applications.service;

import dev.gui.desafio_fullstack.modules.applications.dto.ApplicationRequest;
import dev.gui.desafio_fullstack.modules.applications.dto.ApplicationResponse;
import dev.gui.desafio_fullstack.modules.applications.entity.Application;
import dev.gui.desafio_fullstack.modules.applications.mapper.ApplicationMapper;
import dev.gui.desafio_fullstack.modules.applications.repository.ApplicationRepository;
import dev.gui.desafio_fullstack.modules.jobs.entity.Jobs;
import dev.gui.desafio_fullstack.modules.jobs.enums.JobsStatusEnum;
import dev.gui.desafio_fullstack.modules.jobs.repository.JobsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    private final ApplicationMapper applicationMapper;

    private final JobsRepository jobsRepository;


    @Transactional
    public ApplicationResponse createApplication(ApplicationRequest request){

        Jobs jobs = jobsRepository.findById(request.jobId())
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found with ID: " + request.jobId()));

        if (jobs.getStatus().equals(JobsStatusEnum.CLOSED)) {
            throw new IllegalStateException("It is not possible to apply for a closed position.");
        }

        Application application = applicationMapper.toEntity(request);
        Application savedApplication = applicationRepository.save(application);

        return applicationMapper.toResponse(savedApplication);
    }

    public List<ApplicationResponse> listApplicationsbyJob(Long jobId) {
        if (!jobsRepository.existsById(jobId)) {
            throw new IllegalArgumentException("Job posting not found with ID: " + jobId);
        }

        return applicationRepository.findAllByJobId(jobId)
                .stream()
                .map(applicationMapper::toResponse)
                .toList();
    }

    public ApplicationResponse getApplicationById(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found with ID: " + id));

        return applicationMapper.toResponse(application);
    }

    @Transactional
    public ApplicationResponse updateApplication(Long id, ApplicationRequest request) {
        Application existingApplication = applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found with ID: " + id));

        if (!existingApplication.getJobId().equals(request.jobId())) {
            Jobs newJob = jobsRepository.findById(request.jobId())
                    .orElseThrow(() -> new IllegalArgumentException("Job posting not found with ID: " + request.jobId()));

            if (newJob.getStatus().equals(JobsStatusEnum.CLOSED)) {
                throw new IllegalStateException("It is not possible to move application to a closed position.");
            }
            existingApplication.setJobId(request.jobId());
        }

        existingApplication.setCandidateName(request.candidateName());
        existingApplication.setEmail(request.email());

        Application updatedApplication = applicationRepository.save(existingApplication);
        return applicationMapper.toResponse(updatedApplication);
    }

    @Transactional
    public void deleteApplication(Long id) {
        if (!applicationRepository.existsById(id)) {
            throw new IllegalArgumentException("Application not found with ID: " + id);
        }
        applicationRepository.deleteById(id);
    }
}