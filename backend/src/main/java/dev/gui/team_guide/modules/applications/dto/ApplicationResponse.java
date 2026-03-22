package dev.gui.desafio_fullstack.modules.applications.dto;

import dev.gui.desafio_fullstack.modules.applications.enums.ApplicationStatusEnum;

public record ApplicationResponse(
        Long id,
        Long jobId,
        String candidateName,
        String email,
        ApplicationStatusEnum status
) {
}
