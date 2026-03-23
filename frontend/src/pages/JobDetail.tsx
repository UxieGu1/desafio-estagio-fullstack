import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getJobById, closeJob, updateJob, deleteJob } from "../services/jobService";
import {
  listApplicationsByJob,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
} from "../services/applicationService";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Snackbar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import BlockIcon from "@material-ui/icons/Block";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

const statusMap: Record<
  string,
  { label: string; color: string; textColor: string }
> = {
  UNDER_REVIEW: { label: "Em Análise", color: "#e0e0e0", textColor: "#333" },
  APPROVED: { label: "Aprovada", color: "#4caf50", textColor: "#fff" },
  REJECTED: { label: "Rejeitada", color: "#f44336", textColor: "#fff" },
};

const jobTypeMap: Record<string, string> = {
  INTERNSHIP: "Estágio",
  JUNIOR: "Júnior",
  MID_LEVEL: "Pleno",
  SENIOR: "Sênior",
};

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidateData, setCandidateData] = useState({
    candidateName: "",
    email: "",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ title: "", area: "", type: "" });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showMessage = (message: string, type: "success" | "error" = "success") => {
    setSnackbar({ open: true, message, type });
  };

  const { data: job, isLoading: loadingJob } = useQuery(
    ["job", id],
    () => getJobById(Number(id)),
    { enabled: !!id },
  );

  const { data: applications, isLoading: loadingApps } = useQuery(
    ["applications", id],
    () => listApplicationsByJob(Number(id)),
    { enabled: !!id },
  );

  const applyMutation = useMutation(createApplication, {
    onSuccess: () => {
      queryClient.invalidateQueries(["applications", id]);
      setIsModalOpen(false);
      setCandidateData({ candidateName: "", email: "" });
      showMessage("Candidatura enviada com sucesso!", "success");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.erro || "Erro ao enviar candidatura.";
      showMessage(msg, "error");
    },
  });

  const closeMutation = useMutation(() => closeJob(Number(id)), {
    onSuccess: () => {
      queryClient.invalidateQueries(["job", id]);
      queryClient.invalidateQueries(["jobs"]);
      showMessage("Vaga encerrada! Não são permitidas novas candidaturas.", "success");
    },
    onError: () => showMessage("Erro ao encerrar a vaga.", "error"),
  });

  const updateStatusMutation = useMutation(
    ({ appId, status }: { appId: number; status: string }) =>
      updateApplicationStatus(appId, status),
    {
      onSuccess: () => queryClient.invalidateQueries(["applications", id]),
      onError: () => showMessage("Erro ao atualizar o status do candidato.", "error"),
    },
  );

  const deleteMutation = useMutation(
    (appId: number) => deleteApplication(appId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["applications", id]);
        showMessage("Candidatura excluída!", "success");
      },
      onError: () => showMessage("Erro ao excluir candidatura.", "error"),
    },
  );

  const editJobMutation = useMutation(
    (data: any) => updateJob(Number(id), data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["job", id]);
        queryClient.invalidateQueries(["jobs"]);
        setIsEditModalOpen(false);
        showMessage("Vaga atualizada com sucesso!", "success");
      },
      onError: () => showMessage("Erro ao atualizar vaga.", "error")
    }
  );

  const deleteJobMutation = useMutation(
    () => deleteJob(Number(id)),
    {
      onSuccess: () => {
        showMessage("Vaga excluída com sucesso!", "success");
        navigate("/vagas"); 
      },
      onError: () => showMessage("Erro ao excluir. Remova as candidaturas primeiro.", "error")
    }
  );

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyMutation.mutate({
      jobId: Number(id),
      candidateName: candidateData.candidateName,
      email: candidateData.email,
    });
  };

  const handleCloseClick = () => {
    if (window.confirm("Deseja realmente encerrar esta vaga? Esta ação é irreversível.")) {
      closeMutation.mutate();
    }
  };

  const handleUpdateStatus = (appId: number, status: string) => {
    updateStatusMutation.mutate({ appId, status });
  };

  const handleDelete = (appId: number) => {
    if (window.confirm("Tem certeza que deseja apagar esta candidatura?")) {
      deleteMutation.mutate(appId);
    }
  };

  const handleOpenEdit = () => {
    if (job) {
      setEditData({ title: job.title, area: job.area, type: job.type });
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteJobClick = () => {
    if (window.confirm("ATENÇÃO: Deseja mesmo apagar esta vaga inteira?")) {
      deleteJobMutation.mutate();
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editJobMutation.mutate(editData);
  };

  if (loadingJob || loadingApps) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!job)
    return (
      <Typography color="error" align="center" style={{ marginTop: '20px' }}>
        Vaga não encontrada.
      </Typography>
    );

  const isJobOpen = job.status === "OPEN" || job.status?.toUpperCase() === "ABERTA";

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/vagas")}
          style={{ marginBottom: "20px" }}
        >
          Voltar para Lista
        </Button>

        <Paper elevation={3} style={{ padding: "30px", borderRadius: "12px" }}>
          
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
                <IconButton onClick={handleOpenEdit} disabled={!isJobOpen}>
                  <EditIcon style={{ color: !isJobOpen ? "#ccc" : "#ffa726" }} /> 
                </IconButton>
              </Tooltip>
              
              {isJobOpen && (
                <Tooltip title="Encerrar Vaga">
                  <IconButton
                    onClick={handleCloseClick}
                    disabled={closeMutation.isLoading}
                    style={{ color: "#757575" }}
                  >
                    <BlockIcon />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Apagar Vaga">
                <IconButton onClick={handleDeleteJobClick}>
                  <DeleteForeverIcon style={{ color: "#f44336" }} />
                </IconButton>
              </Tooltip>

            </Box>
          </Box>

          <Divider style={{ margin: "30px 0" }} />

          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" style={{ fontWeight: 600 }}>
                Candidatos ({applications?.length || 0})
              </Typography>

              <Button
                variant="contained"
                style={isJobOpen ? { backgroundColor: "#ffa726", color: "#fff" } : {}}
                disabled={!isJobOpen}
                onClick={() => setIsModalOpen(true)}
              >
                {isJobOpen ? "Candidatar-se" : "Vaga Encerrada"}
              </Button>
            </Box>

            <List>
              {applications && applications.length > 0 ? (
                applications.map((app) => (
                  <React.Fragment key={app.id}>
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
                                onClick={() => handleUpdateStatus(app.id, "APPROVED")}
                                disabled={updateStatusMutation.isLoading}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Reprovar">
                              <IconButton
                                edge="end"
                                style={{ color: "#ff9800", marginRight: "5px" }}
                                onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                                disabled={updateStatusMutation.isLoading}
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
                            onClick={() => handleDelete(app.id)}
                            disabled={deleteMutation.isLoading}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))
              ) : (
                <Box py={5} textAlign="center">
                  <Typography color="textSecondary">
                    Ainda não existem candidaturas para esta posição.
                  </Typography>
                </Box>
              )}
            </List>
          </Box>
        </Paper>
      </Box>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Enviar Candidatura</DialogTitle>
        <form onSubmit={handleApplySubmit}>
          <DialogContent>
            <Typography variant="body2" gutterBottom color="textSecondary">
              Preencha os seus dados para concorrer à vaga:{" "}
              <strong>{job.title}</strong>
            </Typography>
            <TextField
              label="Nome Completo"
              fullWidth
              required
              variant="outlined"
              margin="normal"
              value={candidateData.candidateName}
              onChange={(e) => setCandidateData({ ...candidateData, candidateName: e.target.value })}
            />
            <TextField
              label="E-mail"
              type="email"
              fullWidth
              required
              variant="outlined"
              margin="normal"
              value={candidateData.email}
              onChange={(e) => setCandidateData({ ...candidateData, email: e.target.value })}
            />
          </DialogContent>
          <DialogActions style={{ padding: "16px 24px" }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary" disabled={applyMutation.isLoading} style={{ backgroundColor: "#ffa726", color: "#fff" }}>
              {applyMutation.isLoading ? "Enviando..." : "Confirmar"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar Vaga</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent dividers>
            <TextField
              label="Título da Vaga"
              fullWidth
              required
              variant="outlined"
              margin="normal"
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
            />
            <TextField
              label="Área"
              fullWidth
              required
              variant="outlined"
              margin="normal"
              value={editData.area}
              onChange={(e) => setEditData({...editData, area: e.target.value})}
            />
            <FormControl fullWidth variant="outlined" margin="normal" required>
              <InputLabel>Nível/Tipo</InputLabel>
              <Select
                value={editData.type}
                onChange={(e) => setEditData({...editData, type: e.target.value as string})}
                label="Nível/Tipo"
              >
                <MenuItem value="INTERNSHIP">Estágio</MenuItem>
                <MenuItem value="JUNIOR">Júnior</MenuItem>
                <MenuItem value="MID_LEVEL">Pleno</MenuItem>
                <MenuItem value="SENIOR">Sênior</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions style={{ padding: '16px 24px' }}>
            <Button onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary" disabled={editJobMutation.isLoading} style={{ backgroundColor: "#ffa726", color: "#fff" }}>
              {editJobMutation.isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Paper
          style={{
            padding: "12px 24px",
            backgroundColor: snackbar.type === "success" ? "#4caf50" : "#f44336",
            color: "white",
            fontWeight: 500,
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          {snackbar.message}
        </Paper>
      </Snackbar>
    </Container>
  );
}