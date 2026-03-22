package dev.gui.team_guide.modules.jobs.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobAppCountDTO {
    private String title;
    private Long total;
}
