import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
} from '@material-ui/core';
import { useMutation, useQueryClient } from 'react-query';
import { createJob } from '../services/jobService';
import type { TypeEnum } from '../types';

interface JobFormModalProps {
  open: boolean;
  onClose: () => void;
}

export default function JobFormModal({ open, onClose }: JobFormModalProps) {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: '',
    area: '',
    type: 'INTERNSHIP' as TypeEnum,
    status: 'OPEN' as const,
  });

  const mutation = useMutation(createJob, {
    onSuccess: () => {
      queryClient.invalidateQueries('jobs');
      onClose();
      setFormData({ title: '', area: '', type: 'JUNIOR', status: 'OPEN' }); // Reseta o form
    },
    onError: () => {
      alert('Erro ao criar vaga. Verifique o console ou o backend.');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Cadastrar Nova Vaga</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column">
            <TextField
              label="Título da Vaga"
              name="title"
              fullWidth
              required
              variant="outlined"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              label="Área (Ex: Tecnologia, RH)"
              name="area"
              fullWidth
              required
              variant="outlined"
              value={formData.area}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              select
              label="Nível/Tipo"
              name="type"
              fullWidth
              required
              variant="outlined"
              value={formData.type}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="INTERNSHIP">Estágio</MenuItem>
              <MenuItem value="JUNIOR">Júnior</MenuItem>
              <MenuItem value="MID_LEVEL">Pleno</MenuItem>
              <MenuItem value="SENIOR">Sênior</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px' }}>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Salvando...' : 'Salvar Vaga'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}