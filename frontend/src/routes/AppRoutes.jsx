import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ResidentDashboard from '../pages/resident/ResidentDashboard';
import SecurityDashboard from '../pages/security/SecurityDashboard';
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
import { useAuth } from '../context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/resident"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ResidentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/security"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SecurityDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Placeholder routes for sections; can be replaced with full pages */}
      <Route
        path="/residents"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ResidentsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/visitors"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <VisitorsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
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
      <Route
        path="/maintenance"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MaintenancePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/amenities"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AmenitiesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notices"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <NoticesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ChatPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

