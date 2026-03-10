import { useAuth } from '../context/AuthContext.jsx';
import DashboardCard from '../components/DashboardCard';

export default function SettingsPage() {
  const { user, societyName, logout } = useAuth();

  return (
    <div>
      <h2 className="page-title">Settings</h2>
      <p className="page-subtitle">Profile settings, society preferences, and notifications.</p>

      <div className="dashboard-grid">
        <DashboardCard title="Profile">
          <div style={{ display: 'grid', gap: '0.35rem' }}>
            <div>
              <strong>Name:</strong> {user?.name || '-'}
            </div>
            <div>
              <strong>Email:</strong> {user?.email || '-'}
            </div>
            <div>
              <strong>Role:</strong> {user?.role || '-'}
            </div>
            <div>
              <strong>Society:</strong> {societyName || '-'}
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button type="button" className="btn-primary" style={{ width: 'auto' }} onClick={logout}>
              Logout
            </button>
          </div>
        </DashboardCard>

        <DashboardCard title="Notification Preferences" subtitle="Coming soon">
          <div style={{ color: '#6b7280' }}>
            Email + in-app notifications will be configurable here once backend notifications are wired.
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

