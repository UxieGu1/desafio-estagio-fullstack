package dev.gui.desafio_fullstack.modules.applications.entity;

import dev.gui.desafio_fullstack.modules.applications.enums.ApplicationStatusEnum;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("applications")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Application {

    @Id
    private Long id;

    private Long jobId;

    private String candidateName;

    private String email;

    private ApplicationStatusEnum status;
}
