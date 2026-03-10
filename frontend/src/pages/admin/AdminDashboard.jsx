import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import DashboardCard from '../../components/DashboardCard';
import Table from '../../components/Table';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    api
      .get('/dashboard')
      .then((r) => setStats(r.data))
      .catch(() => setStats(null));

    api
      .get('/visitors')
      .then((r) => setVisitors((r.data || []).slice(0, 5)))
      .catch(() => setVisitors([]));

    api
      .get('/complaints')
      .then((r) => setComplaints((r.data || []).slice(0, 5)))
      .catch(() => setComplaints([]));

    api
      .get('/notices')
      .then((r) => setNotices((r.data || []).slice(0, 3)))
      .catch(() => setNotices([]));
  }, []);

  const complaintDoughnut = useMemo(() => {
    const map = new Map();
    (stats?.complaintStats || []).forEach((row) => map.set(row.status, Number(row.count || 0)));
    const open = map.get('OPEN') || 0;
    const inProg = map.get('IN_PROGRESS') || 0;
    const resolved = map.get('RESOLVED') || 0;
    return {
      labels: ['Open', 'In Progress', 'Resolved'],
      datasets: [
        {
          data: [open, inProg, resolved],
          backgroundColor: ['#F2994A', '#56CCF2', '#27AE60'],
          borderWidth: 0,
        },
      ],
    };
  }, [stats]);

  const revenueSeries = useMemo(() => {
    // placeholder trend until we add time-series API
    const base = Number(stats?.maintenanceRevenue || 0);
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = [0.62, 0.75, 0.68, 0.78, 0.87, 1].map((m) => Math.round(base * m));
    return {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data,
          borderColor: '#2F80ED',
          backgroundColor: 'rgba(47, 128, 237, 0.10)',
          tension: 0.35,
          fill: true,
        },
      ],
    };
  }, [stats]);

  return (
    <div>
      <h2 className="page-title">Admin Dashboard</h2>
      <p className="page-subtitle">Overview of residents, visitors, complaints, and maintenance collection.</p>

      <div className="dashboard-grid">
        <StatCard title="Total residents" value={stats?.residentsCount ?? '—'} subtext="Active in your society" />
        <StatCard title="Visitors today" value={stats?.visitorAnalytics?.today ?? '—'} subtext="Gate activity" />
        <StatCard
          title="Maintenance revenue"
          value={typeof stats?.maintenanceRevenue === 'number' ? `₹ ${stats.maintenanceRevenue}` : '—'}
          subtext="Collected (paid)"
          tone="positive"
        />
        <StatCard
          title="Payment defaulters"
          value={stats?.paymentDefaulters ?? '—'}
          subtext="Overdue payments"
          tone="warning"
        />
      </div>

      <div className="dashboard-grid" style={{ marginTop: '1.25rem' }}>
        <ChartCard title="Maintenance revenue trend" type="line" data={revenueSeries} options={{ responsive: true, maintainAspectRatio: false }} />
        <ChartCard title="Complaint summary" type="doughnut" data={complaintDoughnut} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
      </div>

      <div className="dashboard-grid" style={{ marginTop: '1.25rem' }}>
        <DashboardCard title="Recent visitors">
          <Table
            columns={[
              { key: 'name', label: 'Visitor' },
              { key: 'purpose', label: 'Purpose' },
              { key: 'status', label: 'Status' },
            ]}
            rows={visitors.map((v) => ({ id: v.id, name: v.name, purpose: v.purpose || '-', status: v.status }))}
          />
        </DashboardCard>

        <DashboardCard title="Pending complaints" subtitle="Most recent first">
          <Table
            columns={[
              { key: 'title', label: 'Complaint' },
              { key: 'status', label: 'Status' },
            ]}
            rows={complaints.map((c) => ({ id: c.id, title: c.title, status: c.status }))}
          />
        </DashboardCard>

        <DashboardCard title="Upcoming events" subtitle="From notices">
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            {notices.map((n) => (
              <div key={n.id} style={{ padding: '0.7rem 0.8rem', border: '1px solid #e5e7eb', borderRadius: '0.9rem' }}>
                <div style={{ fontWeight: 600 }}>{n.title}</div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.15rem' }}>{n.content}</div>
              </div>
            ))}
            {!notices.length && <div style={{ color: '#6b7280' }}>No upcoming events yet.</div>}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

