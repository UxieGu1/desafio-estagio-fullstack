import { Routes, Route, Navigate } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  darken,
} from "@material-ui/core";
import JobList from "./pages/JobList";
import JobDetail from "./pages/JobDetail";
import Dashboard from "./pages/DashBoard";
import { COLORS } from "./colors";

const theme = createTheme({
  palette: {
    primary: { main: COLORS.ORANGE, contrastText: COLORS.WHITE },
    secondary: { main: COLORS.WHITE, contrastText: COLORS.ORANGE },
    background: { default: darken(COLORS.WHITE, 0.03), paper: COLORS.WHITE },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Navigate to="/vagas" replace />} />
        <Route path="/vagas" element={<JobList />} />
        <Route path="/vagas/:id" element={<JobDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </ThemeProvider>
  );
}
