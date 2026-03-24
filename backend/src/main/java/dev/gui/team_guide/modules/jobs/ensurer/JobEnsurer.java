package dev.gui.team_guide.modules.jobs.ensurer;

import dev.gui.team_guide.core.exception.BusinessRuleException;
import dev.gui.team_guide.core.exception.ResourceNotFoundException;
import dev.gui.team_guide.modules.jobs.entity.Job;
import dev.gui.team_guide.modules.jobs.enums.JobStatusEnum;
import dev.gui.team_guide.modules.jobs.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JobEnsurer {

    private final JobRepository jobRepository;


    public Job ensureJobExists(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting not found with ID: " + jobId));
    }

     public void ensureJobIsOpen(Job job) {
         if (job.getStatus() == JobStatusEnum.CLOSED) {
             throw new BusinessRuleException("Esta vaga já está encerrada.");
         }
     }
}
