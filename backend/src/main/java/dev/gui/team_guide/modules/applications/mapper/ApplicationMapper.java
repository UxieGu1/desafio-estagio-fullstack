package dev.gui.team_guide.modules.applications.mapper;


import dev.gui.team_guide.modules.applications.dto.ApplicationRequest;
import dev.gui.team_guide.modules.applications.dto.ApplicationResponse;
import dev.gui.team_guide.modules.applications.entity.Application;
import dev.gui.team_guide.modules.applications.enums.ApplicationStatusEnum;
import org.springframework.stereotype.Component;

@Component
public class ApplicationMapper {

    public Application toEntity(ApplicationRequest request) {

        if (request == null) return null;

        return Application.builder()
                .jobId(request.jobId())
                .candidateName(request.candidateName())
                .email(request.email())
                .status(ApplicationStatusEnum.UNDER_REVIEW)
                .build();
    }

    public ApplicationResponse toResponse(Application application) {

        return new ApplicationResponse(
                application.getId(),
                application.getJobId(),
                application.getCandidateName(),
                application.getEmail(),
                application.getStatus()
        );
    }
}