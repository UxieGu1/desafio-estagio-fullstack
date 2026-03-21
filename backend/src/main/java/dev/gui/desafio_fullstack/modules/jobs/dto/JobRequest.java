package dev.gui.desafio_fullstack.modules.jobs.dto;

import dev.gui.desafio_fullstack.modules.jobs.enums.TypeEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record JobRequest(

        @NotBlank(message = "O título é obrigatório")
        @Size(max = 150, message = "O título deve ter no máximo 150 caracteres")
        String title,

        @NotBlank(message = "A área é obrigatória")
        String area,

        @NotNull(message = "O tipo da vaga é obrigatório")
        TypeEnum type
) {
}
