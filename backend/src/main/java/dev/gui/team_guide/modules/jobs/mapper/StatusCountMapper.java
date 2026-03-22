package dev.gui.team_guide.modules.jobs.mapper;

import dev.gui.team_guide.modules.jobs.dto.StatusCountDTO;
import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;

public class StatusCountMapper implements RowMapper<StatusCountDTO> {
    @Override
    public StatusCountDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new StatusCountDTO(
                rs.getString("status"),
                rs.getLong("total")
        );
    }
}