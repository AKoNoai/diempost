import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserSubmission from './pages/UserSubmission';
import PublicLeaderboard from './pages/PublicLeaderboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PokemonSchedule from './pages/PokemonSchedule';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserSubmission />} />
        <Route path="/pokemon" element={<PokemonSchedule />} />
        <Route path="/pokemon-schedule" element={<PokemonSchedule />} />
        <Route path="/leaderboard" element={<PublicLeaderboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
