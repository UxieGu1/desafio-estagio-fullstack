package dev.gui.team_guide.modules.applications.service;

import dev.gui.team_guide.modules.applications.dto.ApplicationRequest;
import dev.gui.team_guide.modules.applications.dto.ApplicationResponse;
import dev.gui.team_guide.modules.applications.entity.Application;
import dev.gui.team_guide.modules.applications.enums.ApplicationStatusEnum;
import dev.gui.team_guide.modules.applications.mapper.ApplicationMapper;
import dev.gui.team_guide.modules.applications.repository.ApplicationRepository;
import dev.gui.team_guide.modules.jobs.entity.Job;
import dev.gui.team_guide.modules.jobs.enums.JobStatusEnum;
import dev.gui.team_guide.modules.jobs.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    private final ApplicationMapper applicationMapper;

    private final JobRepository jobRepository;


    @Transactional
    public ApplicationResponse createApplication(ApplicationRequest request){

        Job jobs = jobRepository.findById(request.jobId())
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found with ID: " + request.jobId()));

        if (jobs.getStatus().equals(JobStatusEnum.CLOSED)) {
            throw new IllegalStateException("It is not possible to apply for a closed position.");
        }

        Application application = applicationMapper.toEntity(request);
        Application savedApplication = applicationRepository.save(application);

        return applicationMapper.toResponse(savedApplication);
    }

    public List<ApplicationResponse> listApplicationsbyJob(Long jobId) {
        if (!jobRepository.existsById(jobId)) {
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
            Job newJob = jobRepository.findById(request.jobId())
                    .orElseThrow(() -> new IllegalArgumentException("Job posting not found with ID: " + request.jobId()));

            if (newJob.getStatus().equals(JobStatusEnum.CLOSED)) {
                throw new IllegalStateException("It is not possible to move application to a closed position.");
            }
            existingApplication.setJobId(request.jobId());
        }

        existingApplication.setCandidateName(request.candidateName());
        existingApplication.setEmail(request.email());

        Application updatedApplication = applicationRepository.save(existingApplication);
        return applicationMapper.toResponse(updatedApplication);
    }

    public ApplicationResponse updateApplicationStatus(Long id, String newStatus) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidatura não encontrada."));

        application.setStatus(ApplicationStatusEnum.valueOf(newStatus));

        Application savedApplication = applicationRepository.save(application);
        return applicationMapper.toResponse(savedApplication);
    }

    @Transactional
    public void deleteApplication(Long id) {
        if (!applicationRepository.existsById(id)) {
            throw new IllegalArgumentException("Application not found with ID: " + id);
        }
        applicationRepository.deleteById(id);
    }
}