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
  darken,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import { COLORS } from "../colors";

const statusMap: Record<
  string,
  { label: string; color: string; textColor: string }
> = {
  UNDER_REVIEW: {
    label: "Em Análise",
    color: darken(COLORS.WHITE, 0.1),
    textColor: COLORS.BLACK,
  },
  APPROVED: { label: "Aprovada", color: COLORS.GREEN, textColor: COLORS.WHITE },
  REJECTED: { label: "Rejeitada", color: COLORS.RED, textColor: COLORS.WHITE },
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
            <CandidateInfo email={app.email} status={app.status} />
          }
        />

        <ListItemSecondaryAction>
          {app.status === "UNDER_REVIEW" && (
            <>
              <Tooltip title="Aprovar">
                <IconButton
                  edge="end"
                  style={{ color: COLORS.GREEN, marginRight: "5px" }}
                  onClick={() => onUpdateStatus(app.id, "APPROVED")}
                  disabled={isUpdating}
                >
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Reprovar">
                <IconButton
                  edge="end"
                  style={{ color: COLORS.RED, marginRight: "5px" }}
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
              style={{ color: COLORS.RED }}
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

interface CandidateInfoProps {
  email: string;
  status: string;
}

const CandidateInfo = ({ email, status }: CandidateInfoProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      style={{ gap: "10px", marginTop: "4px" }}
    >
      <Typography variant="body2">{email}</Typography>
      <Chip
        size="small"
        label={statusMap[status]?.label || status}
        style={{
          backgroundColor: statusMap[status]?.color,
          color: statusMap[status]?.textColor,
          fontSize: "0.7rem",
        }}
      />
    </Box>
  );
};