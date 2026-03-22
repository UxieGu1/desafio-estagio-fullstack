package dev.gui.desafio_fullstack.modules.applications.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ApplicationRequest(
        @NotNull(message = "O ID da vaga é obrigatório")
        Long jobId,

        @NotBlank(message = "O nome do candidato é obrigatório")
        @Size(max = 150, message = "O nome deve ter no máximo 150 caracteres")
        String candidateName,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "O formato do e-mail é inválido")
        String email
) {
}
