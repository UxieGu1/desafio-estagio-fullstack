package dev.gui.desafio_fullstack.modules.jobs.dto;

import dev.gui.desafio_fullstack.modules.jobs.enums.JobStatusEnum;
import dev.gui.desafio_fullstack.modules.jobs.enums.TypeEnum;

public record JobResponse(
        Long id,
        String title,
        String area,
        TypeEnum type,
        JobStatusEnum status
) {
}
