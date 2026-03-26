import { useAuth } from '../context/AuthContext.jsx';
import DashboardCard from '../components/DashboardCard';

export default function SettingsPage() {
  const { user, societyName, logout } = useAuth();

  return (
    <div className="p-4">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="page-title text-2xl font-semibold flex items-center gap-2">
          ⚙️ Settings
        </h2>
        <p className="page-subtitle text-sm text-gray-500">
          Profile settings, society preferences, and notifications.
        </p>
      </div>

      <div className="dashboard-grid gap-4">

        {/* Profile Card */}
        <DashboardCard title="Profile">
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium text-gray-600">Name</span>
              <span>{user?.name || '-'}</span>
            </div>

            <div className="flex justify-between border-b pb-1">
              <span className="font-medium text-gray-600">Email</span>
              <span>{user?.email || '-'}</span>
            </div>

            <div className="flex justify-between border-b pb-1">
              <span className="font-medium text-gray-600">Role</span>
              <span className="capitalize">{user?.role || '-'}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Society</span>
              <span>{societyName || '-'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="btn-primary px-4 py-2 rounded-lg hover:scale-[1.02] active:scale-95 transition"
              onClick={logout}
            >
              🚪 Logout
            </button>
          </div>
        </DashboardCard>

        {/* Notifications Card */}
        <DashboardCard
          title="Notification Preferences"
          subtitle="Coming soon"
        >
          <div className="text-gray-500 text-sm leading-relaxed">
            📩 Email and in-app notifications will be configurable here once
            backend notification services are integrated.
          </div>

          {/* Disabled UI Preview */}
          <div className="mt-4 space-y-2 opacity-60 pointer-events-none">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <input type="checkbox" disabled />
            </div>
            <div className="flex items-center justify-between">
              <span>App Notifications</span>
              <input type="checkbox" disabled />
            </div>
          </div>
        </DashboardCard>

      </div>
    </div>
  );
}

