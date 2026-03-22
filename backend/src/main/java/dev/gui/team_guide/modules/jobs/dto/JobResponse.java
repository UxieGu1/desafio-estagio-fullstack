package dev.gui.team_guide.modules.jobs.dto;

import dev.gui.team_guide.modules.jobs.enums.JobStatusEnum;
import dev.gui.team_guide.modules.jobs.enums.TypeEnum;

public record JobResponse(
        Long id,
        String title,
        String area,
        TypeEnum type,
        JobStatusEnum status
) {
}
