import React from "react";
import { Box, Typography, Chip, Tooltip, IconButton } from "@material-ui/core";
import BlockIcon from "@material-ui/icons/Block";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

const jobTypeMap: Record<string, string> = {
  INTERNSHIP: "Estágio",
  JUNIOR: "Júnior",
  MID_LEVEL: "Pleno",
  SENIOR: "Sênior",
};

interface JobDetailHeaderProps {
  job: any;
  isJobOpen: boolean;
  onEdit: () => void;
  onCloseJob: () => void;
  onDeleteJob: () => void;
  isClosing: boolean;
}

export default function JobDetailHeader({
  job,
  isJobOpen,
  onEdit,
  onCloseJob,
  onDeleteJob,
  isClosing,
}: JobDetailHeaderProps) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
      <Box>
        <Typography variant="h4" style={{ fontWeight: 700, color: "#333" }}>
          {job.title}
        </Typography>
        <Box mt={1} display="flex" alignItems="center" style={{ gap: "10px" }}>
          <Chip
            label={isJobOpen ? "Aberta" : "Fechada"}
            color={isJobOpen ? "primary" : "default"}
            style={isJobOpen ? { backgroundColor: "#ffa726", color: "#fff" } : {}}
          />
          <Typography variant="subtitle1" color="textSecondary">
            {job.area} • {jobTypeMap[job.type] || job.type}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" style={{ gap: "5px" }}>
        <Tooltip title="Editar Vaga">
          <IconButton onClick={onEdit} disabled={!isJobOpen}>
            <EditIcon style={{ color: !isJobOpen ? "#ccc" : "#ffa726" }} />
          </IconButton>
        </Tooltip>

        {isJobOpen && (
          <Tooltip title="Encerrar Vaga">
            <IconButton
              onClick={onCloseJob}
              disabled={isClosing}
              style={{ color: "#757575" }}
            >
              <BlockIcon />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Apagar Vaga">
          <IconButton onClick={onDeleteJob}>
            <DeleteForeverIcon style={{ color: "#f44336" }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}