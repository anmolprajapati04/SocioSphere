import { Navigate, Route, Routes } from 'react-router-dom';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import ResidentDashboard from '../pages/dashboard/ResidentDashboard';
import SecurityDashboard from '../pages/dashboard/SecurityDashboard';
import ResidentsPage from '../pages/ResidentsPage';
import VisitorsPage from '../pages/VisitorsPage';
import ComplaintsPage from '../pages/ComplaintsPage';
import MaintenancePage from '../pages/MaintenancePage';
import AmenitiesPage from '../pages/AmenitiesPage';
import NoticesPage from '../pages/NoticesPage';
import SettingsPage from '../pages/SettingsPage';
import ChatPage from '../pages/ChatPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import Home from '../pages/Home';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext.jsx';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={`/${user?.role?.toLowerCase()}`} replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resident"
        element={
          <ProtectedRoute allowedRoles={['Resident']}>
            <ResidentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/security"
        element={
          <ProtectedRoute allowedRoles={['Security']}>
            <SecurityDashboard />
          </ProtectedRoute>
        }
      />

      {/* Shared protected routes */}
      <Route
        path="/admin/residents"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <DashboardLayout>
              <ResidentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* Add other sub-routes as needed, or keep them generic if they apply to all */}
      <Route
        path="/complaints"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ComplaintsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* ... other routes ... */}
    </Routes>
  );
}

