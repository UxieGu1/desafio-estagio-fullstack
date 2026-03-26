import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getJobById,
  closeJob,
  updateJob,
  deleteJob,
} from "../services/jobService";
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
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import ApplyJobModal from "../components/ApplyJobModal";
import JobDetailHeader from "../components/JobDetailHeader";
import CandidateListItem from "../components/CandidateListItem";
import { COLORS } from "../colors";

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

  const showMessage = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
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
      showMessage(
        "Vaga encerrada! Não são permitidas novas candidaturas.",
        "success",
      );
    },
    onError: () => showMessage("Erro ao encerrar a vaga.", "error"),
  });

  const updateStatusMutation = useMutation(
    ({ appId, status }: { appId: number; status: string }) =>
      updateApplicationStatus(appId, status),
    {
      onSuccess: () => queryClient.invalidateQueries(["applications", id]),
      onError: () =>
        showMessage("Erro ao atualizar o status do candidato.", "error"),
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
      onError: () => showMessage("Erro ao atualizar vaga.", "error"),
    },
  );

  const deleteJobMutation = useMutation(() => deleteJob(Number(id)), {
    onSuccess: () => {
      showMessage("Vaga excluída com sucesso!", "success");
      navigate("/vagas");
    },
    onError: () =>
      showMessage("Erro ao excluir. Remova as candidaturas primeiro.", "error"),
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyMutation.mutate({
      jobId: Number(id),
      candidateName: candidateData.candidateName,
      email: candidateData.email,
    });
  };

  const handleCloseClick = () => {
    if (
      window.confirm(
        "Deseja realmente encerrar esta vaga? Esta ação é irreversível.",
      )
    ) {
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!job)
    return (
      <Typography color="error" align="center" style={{ marginTop: "20px" }}>
        Vaga não encontrada.
      </Typography>
    );

  const isJobOpen =
    job.status === "OPEN" || job.status?.toUpperCase() === "ABERTA";

  const hasApplications = applications && applications.length > 0;

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
          <JobDetailHeader
            job={job}
            isJobOpen={isJobOpen}
            onEdit={handleOpenEdit}
            onCloseJob={handleCloseClick}
            onDeleteJob={handleDeleteJobClick}
            isClosing={closeMutation.isLoading}
          />

          <Divider style={{ margin: "30px 0" }} />

          <Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h5" style={{ fontWeight: 600 }}>
                Candidatos ({applications?.length || 0})
              </Typography>

              <Button
                variant="contained"
                style={
                  isJobOpen
                    ? { backgroundColor: COLORS.ORANGE, color: COLORS.WHITE }
                    : {}
                }
                disabled={!isJobOpen}
                onClick={() => setIsModalOpen(true)}
              >
                {isJobOpen ? "Candidatar-se" : "Vaga Encerrada"}
              </Button>
            </Box>

            <List>
              {hasApplications ? (
                applications.map((app: any) => (
                  <CandidateListItem
                    key={app.id}
                    app={app}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDelete}
                    isUpdating={updateStatusMutation.isLoading}
                    isDeleting={deleteMutation.isLoading}
                  />
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

      <ApplyJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleApplySubmit}
        candidateData={candidateData}
        setCandidateData={setCandidateData}
        isLoading={applyMutation.isLoading}
        jobTitle={job.title}
      />

      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
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
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
            />
            <TextField
              label="Área"
              fullWidth
              required
              variant="outlined"
              margin="normal"
              value={editData.area}
              onChange={(e) =>
                setEditData({ ...editData, area: e.target.value })
              }
            />
            <FormControl fullWidth variant="outlined" margin="normal" required>
              <InputLabel>Nível/Tipo</InputLabel>
              <Select
                value={editData.type}
                onChange={(e) =>
                  setEditData({ ...editData, type: e.target.value as string })
                }
                label="Nível/Tipo"
              >
                <MenuItem value="INTERNSHIP">Estágio</MenuItem>
                <MenuItem value="JUNIOR">Júnior</MenuItem>
                <MenuItem value="MID_LEVEL">Pleno</MenuItem>
                <MenuItem value="SENIOR">Sênior</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions style={{ padding: "16px 24px" }}>
            <Button onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={editJobMutation.isLoading}
              style={{ backgroundColor: COLORS.ORANGE_TWO, color: COLORS.WHITE }}
            >
              {editJobMutation.isLoading ? "Salvando..." : "Salvar Alterações"}
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
            backgroundColor:
              snackbar.type === "success" ? COLORS.GREEN : COLORS.RED,
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