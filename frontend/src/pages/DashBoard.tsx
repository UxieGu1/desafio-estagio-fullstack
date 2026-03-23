import React from 'react';
import { useQuery } from 'react-query';
import { getDashboardStatusCount, getDashboardApplicationCount } from '../services/jobService';
import { Container, Typography, Box, Paper, Grid, CircularProgress, Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

const COLORS = ['#4caf50', '#f44336', '#2196f3', '#ff9800'];

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: statusData, isLoading: loadingStatus } = useQuery('dashStatus', getDashboardStatusCount);
  const { data: appsData, isLoading: loadingApps } = useQuery('dashApps', getDashboardApplicationCount);

  if (loadingStatus || loadingApps) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const vagasAbertas = statusData?.find((d: any) => d.status === 'OPEN')?.total || 0;
  const vagasFechadas = statusData?.find((d: any) => d.status === 'CLOSED')?.total || 0;
  const totalVagas = vagasAbertas + vagasFechadas;

  const dataPizza = statusData?.map((item: any) => ({
    name: item.status === 'OPEN' ? 'Abertas' : 'Encerradas',
    value: Number(item.total)
  })) || [];

  const dataBarras = appsData?.map((item: any) => ({
    nome: item.title,
    Candidatos: Number(item.total)
  })) || [];

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/vagas')} style={{ marginBottom: '20px' }}>
          Voltar para Vagas
        </Button>

        <Typography variant="h4" style={{ fontWeight: 700, color: '#333', marginBottom: '30px' }}>
          Dashboard
        </Typography>

        <Grid container spacing={4} style={{ marginBottom: '40px' }}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center', borderTop: '5px solid #2196f3' }}>
              <Typography variant="h6" color="textSecondary">Total de Vagas</Typography>
              <Typography variant="h3" style={{ fontWeight: 'bold' }}>{totalVagas}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center', borderTop: '5px solid #4caf50' }}>
              <Typography variant="h6" color="textSecondary">Vagas Abertas</Typography>
              <Typography variant="h3" style={{ fontWeight: 'bold', color: '#4caf50' }}>{vagasAbertas}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center', borderTop: '5px solid #f44336' }}>
              <Typography variant="h6" color="textSecondary">Vagas Encerradas</Typography>
              <Typography variant="h3" style={{ fontWeight: 'bold', color: '#f44336' }}>{vagasFechadas}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper elevation={3} style={{ padding: '20px', height: '400px' }}>
              <Typography variant="h6" align="center" gutterBottom>Distribuição por Status</Typography>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie 
                    data={dataPizza} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={80} 
                    outerRadius={120} 
                    paddingAngle={5} 
                    dataKey="value" 
                    label
                    isAnimationActive={true}
                    animationBegin={100}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {dataPizza.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Abertas' ? COLORS[0] : COLORS[1]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper elevation={3} style={{ padding: '20px', height: '400px' }}>
              <Typography variant="h6" align="center" gutterBottom>Top 5 Vagas por Candidaturas</Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={dataBarras} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="nome" type="category" width={150} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar 
                    dataKey="Candidatos" 
                    fill="#ff9800" 
                    radius={[0, 5, 5, 0]} 
                    isAnimationActive={true}
                    animationBegin={400}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}