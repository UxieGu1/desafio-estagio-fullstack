package dev.gui.desafio_fullstack.modules.jobs.entity;

import dev.gui.desafio_fullstack.modules.jobs.enums.JobsStatusEnum;
import dev.gui.desafio_fullstack.modules.jobs.enums.TypeEnum;
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
public class Jobs {

    @Id
    @Column("id")
    private Long id;

    private String title;

    private String area;

    private TypeEnum type;

    private JobsStatusEnum status;

}
