import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  candidateData: { candidateName: string; email: string };
  setCandidateData: (data: any) => void;
  isLoading: boolean;
  jobTitle: string;
}

export default function ApplyJobModal({
  isOpen,
  onClose,
  onSubmit,
  candidateData,
  setCandidateData,
  isLoading,
  jobTitle,
}: ApplyJobModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Enviar Candidatura</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Typography variant="body2" gutterBottom color="textSecondary">
            Preencha os seus dados para concorrer à vaga:{" "}
            <strong>{jobTitle}</strong>
          </Typography>
          <TextField
            label="Nome Completo"
            fullWidth
            required
            variant="outlined"
            margin="normal"
            value={candidateData.candidateName}
            onChange={(e) =>
              setCandidateData({
                ...candidateData,
                candidateName: e.target.value,
              })
            }
          />
          <TextField
            label="E-mail"
            type="email"
            fullWidth
            required
            variant="outlined"
            margin="normal"
            value={candidateData.email}
            onChange={(e) =>
              setCandidateData({ ...candidateData, email: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions style={{ padding: "16px 24px" }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            style={{ backgroundColor: "#ffa726", color: "#fff" }}
          >
            {isLoading ? "Enviando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
