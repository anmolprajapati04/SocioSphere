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
import ResidentDirectory from '../pages/ResidentDirectory';
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
        path="/directory"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ResidentDirectory />
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
    </Routes>
  );
}

