package dev.gui.team_guide.modules.applications.entity;

import dev.gui.team_guide.modules.applications.enums.ApplicationStatusEnum;
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
