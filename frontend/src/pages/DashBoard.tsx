import { useQuery } from "react-query";
import {
  getDashboardStatusCount,
  getDashboardApplicationCount,
} from "../services/jobService";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  CircularProgress,
  Button,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { COLORS } from "../colors";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: statusData, isLoading: loadingStatus } = useQuery(
    "dashStatus",
    getDashboardStatusCount,
  );
  const { data: appsData, isLoading: loadingApps } = useQuery(
    "dashApps",
    getDashboardApplicationCount,
  );

  if (loadingStatus || loadingApps) {
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

  const vagasAbertas =
    statusData?.find((d: any) => d.status === "OPEN")?.total || 0;
  const vagasFechadas =
    statusData?.find((d: any) => d.status === "CLOSED")?.total || 0;
  const totalVagas = vagasAbertas + vagasFechadas;

  const dataPizza =
    statusData?.map((item: any) => ({
      name: item.status === "OPEN" ? "Abertas" : "Encerradas",
      value: Number(item.total),
    })) || [];

  const dataBarras =
    appsData?.map((item: any) => ({
      nome: item.title,
      Candidatos: Number(item.total),
    })) || [];

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/vagas")}
          style={{ marginBottom: "20px" }}
        >
          Voltar para Vagas
        </Button>

        <Typography
          variant="h4"
          style={{ fontWeight: 700, color: "#", marginBottom: "30px" }}
        >
          Dashboard
        </Typography>

        <Grid container spacing={4} style={{ marginBottom: "40px" }}>
          
          <StatCard
            label="Total de Vagas"
            value={totalVagas}
            color={COLORS.BLUE}
          />
          <StatCard
            label="Vagas Abertas"
            value={vagasAbertas}
            color={COLORS.GREEN}
            valueColor={COLORS.GREEN}
          />
          <StatCard
            label="Vagas Encerradas"
            value={vagasFechadas}
            color={COLORS.RED}
            valueColor={COLORS.RED}
          />

        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper elevation={3} style={{ padding: "20px", height: "400px" }}>
              <Typography variant="h6" align="center" gutterBottom>
                Distribuição por Status
              </Typography>
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
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name === "Abertas" ? COLORS.GREEN : COLORS.RED
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper elevation={3} style={{ padding: "20px", height: "400px" }}>
              <Typography variant="h6" align="center" gutterBottom>
                Top 5 Vagas por Candidaturas
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={dataBarras}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis
                    dataKey="nome"
                    type="category"
                    width={150}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="Candidatos"
                    fill={COLORS.ORANGE}
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

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  valueColor?: string; 
}

const StatCard = ({ label, value, color, valueColor }: StatCardProps) => {
  return (
    <Grid item xs={12} sm={4}>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          textAlign: "center",
          borderTop: `5px solid ${color}`,
        }}
      >
        <Typography variant="h6" color="textSecondary">
          {label}
        </Typography>
        <Typography
          variant="h3"
          style={{ fontWeight: "bold", color: valueColor || "inherit" }}
        >
          {value}
        </Typography>
      </Paper>
    </Grid>
  );
};