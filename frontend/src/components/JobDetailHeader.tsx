import {
  Box,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  styled,
} from "@material-ui/core";
import BlockIcon from "@material-ui/icons/Block";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { COLORS } from "../colors";

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
    <Container>
      <Box>
        <Typography variant="h4" style={{ fontWeight: 700, color: COLORS.BLACK }}>
          {job.title}
        </Typography>
        
        <JobInfo isJobOpen={isJobOpen} area={job.area} type={job.type} />
      </Box>

      <ActionsContainer>
        <Tooltip title="Editar Vaga">
          <IconButton onClick={onEdit} disabled={!isJobOpen}>
            <EditIcon style={{ color: !isJobOpen ? COLORS.GRAY_TWO : COLORS.ORANGE }} />
          </IconButton>
        </Tooltip>

        {isJobOpen && (
          <Tooltip title="Encerrar Vaga">
            <IconButton
              onClick={onCloseJob}
              disabled={isClosing}
              style={{ color: COLORS.GRAY}}
            >
              <BlockIcon />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Apagar Vaga">
          <IconButton onClick={onDeleteJob}>
            <DeleteForeverIcon style={{ color: COLORS.RED }} />
          </IconButton>
        </Tooltip>
      </ActionsContainer>
    </Container>
  );
}

const Container = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  mb: 2,
});

const ActionsContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "5px",
});

interface JobInfoProps {
  isJobOpen: boolean;
  area: string;
  type: string;
}

const JobInfo = ({ isJobOpen, area, type }: JobInfoProps) => {
  return (
    <Box mt={1} display="flex" alignItems="center" style={{ gap: "10px" }}>
      <Chip
        label={isJobOpen ? "Aberta" : "Fechada"}
        color={isJobOpen ? "primary" : "default"}
        style={
          isJobOpen ? { backgroundColor: COLORS.ORANGE_TWO, color: COLORS.WHITE } : {}
        }
      />
      <Typography variant="subtitle1" color="textSecondary">
        {area} • {jobTypeMap[type] || type}
      </Typography>
    </Box>
  );
};