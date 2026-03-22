package dev.gui.team_guide.modules.jobs.mapper;

import dev.gui.team_guide.modules.jobs.dto.JobRequest;
import dev.gui.team_guide.modules.jobs.dto.JobResponse;
import dev.gui.team_guide.modules.jobs.entity.Job;
import dev.gui.team_guide.modules.jobs.enums.JobStatusEnum;
import org.springframework.stereotype.Component;

@Component
public class JobMapper {

    public Job toEntity(JobRequest jobRequest) {

        if (jobRequest == null) return null;

        return Job.builder()
                .title(jobRequest.title())
                .area(jobRequest.area())
                .type(jobRequest.type())
                .status(JobStatusEnum.OPEN)
                .build();
    }

    public JobResponse toResponse(Job job) {

        if (job == null) return null;

        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getArea(),
                job.getType(),
                job.getStatus()
        );
    }
}