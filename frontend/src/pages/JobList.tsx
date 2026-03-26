import React, { useState } from "react";
import { useQuery } from "react-query";
import { getJobs } from "../services/jobService";
import type { Page, Jobs } from "../types";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Box,
  Paper,
  Grid,
  Chip,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import JobFormModal from "../components/JobFormModal";
import SearchBar from "../components/SearchBar";

const typeMap: Record<string, string> = {
  INTERNSHIP: "Estágio",
  JUNIOR: "Júnior",
  MID_LEVEL: "Pleno",
  SENIOR: "Sênior",
};

export default function JobList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  const { data, isLoading, error } = useQuery<Page<Jobs>>(
    ["jobs", page, activeFilter],
    () => getJobs(page, 10, activeFilter),
    { keepPreviousData: true },
  );

  const handleSearch = () => {
    setPage(0);
    setActiveFilter(searchInput);
  };

  const handleClear = () => {
    setSearchInput("");
    setActiveFilter("");
    setPage(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (isLoading && !data) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4} textAlign="center">
        <Typography color="error" variant="h6">
          Erro ao carregar vagas. Verifica se o Back-end está a correr.
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        my={4}
      >
        <Typography
          variant="h4"
          component="h1"
          style={{ fontWeight: "bold", color: "#333" }}
        >
          Vagas TeamGuide
        </Typography>
        <Box>
          <Button
            component={Link}
            to="/dashboard"
            variant="outlined"
            color="primary"
            style={{ marginRight: "15px" }}
          >
            Dashboard
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setIsModalOpen(true)}
          >
            Nova Vaga
          </Button>
        </Box>
      </Box>

      <SearchBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
        handleClear={handleClear}
        handleKeyPress={handleKeyPress}
      />

      <Grid container spacing={3}>
        {data?.content && data.content.length > 0 ? (
          data.content.map((job) => (
            <Grid item xs={12} key={job.id}>
              <Paper
                elevation={2}
                style={{ padding: "20px", borderRadius: "8px" }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box>
                    <Typography
                      variant="h6"
                      color="primary"
                      style={{ fontWeight: 600 }}
                    >
                      {job.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      Área: {job.area} • Tipo: {typeMap[job.type] || job.type}
                    </Typography>
                    <Box mt={1}>
                      <Chip
                        label={job.status === "OPEN" ? "Aberta" : "Fechada"}
                        color={job.status === "OPEN" ? "primary" : "default"}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Button
                    component={Link}
                    to={`/vagas/${job.id}`}
                    variant="outlined"
                    color="primary"
                  >
                    Detalhes
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box textAlign="center" py={5}>
              <Typography variant="body1" color="textSecondary">
                Nenhuma vaga encontrada com os filtros selecionados.
              </Typography>
              <Button
                color="primary"
                style={{ marginTop: "10px" }}
                onClick={handleClear}
              >
                Limpar Pesquisa
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      <JobFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Container>
  );
}
