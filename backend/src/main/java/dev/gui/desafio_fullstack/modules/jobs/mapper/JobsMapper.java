package dev.gui.desafio_fullstack.modules.jobs.mapper;

import dev.gui.desafio_fullstack.modules.jobs.dto.JobsRequest;
import dev.gui.desafio_fullstack.modules.jobs.dto.JobsResponse;
import dev.gui.desafio_fullstack.modules.jobs.entity.Jobs;
import dev.gui.desafio_fullstack.modules.jobs.enums.JobsStatusEnum;
import org.springframework.stereotype.Component;

@Component
public class JobsMapper {

    public Jobs toEntity(JobsRequest jobsRequest) {

        if (jobsRequest == null) return null;

        return Jobs.builder()
                .title(jobsRequest.title())
                .area(jobsRequest.area())
                .type(jobsRequest.type())
                .status(JobsStatusEnum.OPEN)
                .build();
    }

    public JobsResponse toResponse(Jobs job) {

        if (job == null) return null;

        return new JobsResponse(
                job.getId(),
                job.getTitle(),
                job.getArea(),
                job.getType(),
                job.getStatus()
        );
    }
}