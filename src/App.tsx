import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { AuthProvider } from './context/AuthContext';
import { MealProvider } from './context/MealContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Meditation from './pages/Meditation';
import MealTracker from './pages/MealTracker';
import WaterTracker from './pages/WaterTracker';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <MealProvider>
          <Router>
            <Layout>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="meditation" element={<Meditation />} />
                <Route path="meals" element={<MealTracker />} />
                <Route path="water" element={<WaterTracker />} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </Layout>
          </Router>
        </MealProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 