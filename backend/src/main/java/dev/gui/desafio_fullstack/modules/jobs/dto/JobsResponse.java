package dev.gui.desafio_fullstack.modules.jobs.dto;

import dev.gui.desafio_fullstack.modules.jobs.enums.JobsStatusEnum;
import dev.gui.desafio_fullstack.modules.jobs.enums.TypeEnum;

public record JobsResponse(
        Long id,
        String title,
        String area,
        TypeEnum type,
        JobsStatusEnum status
) {
}
