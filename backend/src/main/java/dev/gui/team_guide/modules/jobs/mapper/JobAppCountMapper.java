package dev.gui.team_guide.modules.jobs.mapper;

import dev.gui.team_guide.modules.jobs.dto.JobAppCountDTO;
import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;

public class JobAppCountMapper implements RowMapper<JobAppCountDTO> {
    @Override
    public JobAppCountDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new JobAppCountDTO(
                rs.getString("title"),
                rs.getLong("total")
        );
    }
}