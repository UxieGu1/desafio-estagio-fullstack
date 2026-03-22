package dev.gui.team_guide.modules.jobs.entity;

import dev.gui.team_guide.modules.jobs.enums.JobStatusEnum;
import dev.gui.team_guide.modules.jobs.enums.TypeEnum;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("jobs")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Job {

    @Id
    @Column("id")
    private Long id;

    private String title;

    private String area;

    private TypeEnum type;

    private JobStatusEnum status;

}
