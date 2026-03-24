import React from "react";
import {
  ListItem,
  ListItemText,
  Typography,
  Box,
  Chip,
  ListItemSecondaryAction,
  Tooltip,
  IconButton,
  Divider,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";

const statusMap: Record<string, { label: string; color: string; textColor: string }> = {
  UNDER_REVIEW: { label: "Em Análise", color: "#e0e0e0", textColor: "#333" },
  APPROVED: { label: "Aprovada", color: "#4caf50", textColor: "#fff" },
  REJECTED: { label: "Rejeitada", color: "#f44336", textColor: "#fff" },
};

interface CandidateListItemProps {
  app: any;
  onUpdateStatus: (id: number, status: string) => void;
  onDelete: (id: number) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export default function CandidateListItem({
  app,
  onUpdateStatus,
  onDelete,
  isUpdating,
  isDeleting,
}: CandidateListItemProps) {
  return (
    <React.Fragment>
      <ListItem style={{ padding: "15px 0" }}>
        <ListItemText
          primary={
            <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
              {app.candidateName}
            </Typography>
          }
          secondary={
            <Box display="flex" alignItems="center" style={{ gap: "10px", marginTop: "4px" }}>
              <Typography variant="body2">{app.email}</Typography>
              <Chip
                size="small"
                label={statusMap[app.status]?.label || app.status}
                style={{
                  backgroundColor: statusMap[app.status]?.color,
                  color: statusMap[app.status]?.textColor,
                  fontSize: "0.7rem",
                }}
              />
            </Box>
          }
        />

        <ListItemSecondaryAction>
          {app.status === "UNDER_REVIEW" && (
            <>
              <Tooltip title="Aprovar">
                <IconButton
                  edge="end"
                  style={{ color: "#4caf50", marginRight: "5px" }}
                  onClick={() => onUpdateStatus(app.id, "APPROVED")}
                  disabled={isUpdating}
                >
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Reprovar">
                <IconButton
                  edge="end"
                  style={{ color: "#ff9800", marginRight: "5px" }}
                  onClick={() => onUpdateStatus(app.id, "REJECTED")}
                  disabled={isUpdating}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          <Tooltip title="Excluir Candidatura">
            <IconButton
              edge="end"
              style={{ color: "#f44336" }}
              onClick={() => onDelete(app.id)}
              disabled={isDeleting}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider component="li" />
    </React.Fragment>
  );
}