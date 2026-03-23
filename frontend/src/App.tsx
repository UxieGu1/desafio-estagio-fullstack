import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@material-ui/core';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import Dashboard from './pages/DashBoard';

const theme = createTheme({
  palette: {
    primary: { main: '#ff9800', contrastText: '#ffffff' },
    secondary: { main: '#ffffff', contrastText: '#ff9800' },
    background: { default: '#f4f6f8', paper: '#ffffff' },
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
