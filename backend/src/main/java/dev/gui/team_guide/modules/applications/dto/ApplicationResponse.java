package dev.gui.team_guide.modules.applications.dto;

import dev.gui.team_guide.modules.applications.enums.ApplicationStatusEnum;

public record ApplicationResponse(
        Long id,
        Long jobId,
        String candidateName,
        String email,
        ApplicationStatusEnum status
) {
}
