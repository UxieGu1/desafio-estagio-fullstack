package dev.gui.team_guide.modules.applications.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateStatusRequest(
        @NotBlank(message = "O status não pode estar em branco")
        String status
) {
}