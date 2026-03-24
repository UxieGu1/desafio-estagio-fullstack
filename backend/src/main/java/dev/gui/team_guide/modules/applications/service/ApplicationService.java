package dev.gui.team_guide.modules.applications.service;

import dev.gui.team_guide.modules.applications.dto.ApplicationRequest;
import dev.gui.team_guide.modules.applications.dto.ApplicationResponse;
import dev.gui.team_guide.modules.applications.ensurer.ApplicationEnsurer;
import dev.gui.team_guide.modules.applications.entity.Application;
import dev.gui.team_guide.modules.applications.enums.ApplicationStatusEnum;
import dev.gui.team_guide.modules.applications.mapper.ApplicationMapper;
import dev.gui.team_guide.modules.applications.repository.ApplicationRepository;
import dev.gui.team_guide.modules.jobs.ensurer.JobEnsurer;
import dev.gui.team_guide.modules.jobs.entity.Job;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {


    private final ApplicationRepository applicationRepository;

    private final ApplicationMapper applicationMapper;

    private final ApplicationEnsurer applicationEnsurer;

    private final JobEnsurer jobEnsurer;


    @Transactional
    public ApplicationResponse createApplication(ApplicationRequest request){

        Job job = jobEnsurer.ensureJobExists(request.jobId());

        jobEnsurer.ensureJobIsOpen(job);

        Application application = applicationMapper.toEntity(request);
        Application savedApplication = applicationRepository.save(application);

        return applicationMapper.toResponse(savedApplication);
    }

    public List<ApplicationResponse> listApplicationsbyJob(Long jobId) {

        jobEnsurer.ensureJobExists(jobId);

        return applicationRepository.findAllByJobId(jobId)
                .stream()
                .map(applicationMapper::toResponse)
                .toList();
    }

    public ApplicationResponse getApplicationById(Long applicationId) {

        Application application = applicationEnsurer.ensureApplicationExists(applicationId);
        return applicationMapper.toResponse(application);
    }

    @Transactional
    public ApplicationResponse updateApplication(Long applicationId, ApplicationRequest request) {
        Application existingApplication = applicationEnsurer.ensureApplicationExists(applicationId);

        if (!existingApplication.getJobId().equals(request.jobId())) {
            Job newJob = jobEnsurer.ensureJobExists(request.jobId());
            jobEnsurer.ensureJobIsOpen(newJob);

            existingApplication.setJobId(request.jobId());
        }

        existingApplication.setCandidateName(request.candidateName());
        existingApplication.setEmail(request.email());

        Application updatedApplication = applicationRepository.save(existingApplication);
        return applicationMapper.toResponse(updatedApplication);
    }

    public ApplicationResponse updateApplicationStatus(Long applicationId, String newStatus) {
        Application application = applicationEnsurer.ensureApplicationExists(applicationId);

        application.setStatus(ApplicationStatusEnum.valueOf(newStatus));

        Application savedApplication = applicationRepository.save(application);
        return applicationMapper.toResponse(savedApplication);
    }

    @Transactional
    public void deleteApplication(Long applicationId) {
        Application application = applicationEnsurer.ensureApplicationExists(applicationId);
        applicationRepository.delete(application);
    }
}