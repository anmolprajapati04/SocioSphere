import { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import Table from '../components/Table';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  function load() {
    api
      .get('/complaints')
      .then((r) => setComplaints(r.data || []))
      .catch(() => setComplaints([]));
  }

  useEffect(() => {
    load();
  }, []);

  function submit(e) {
    e.preventDefault();
    if (!form.title || !form.description) {
      setError('Title and description are required.');
      return;
    }
    setError('');
    api
      .post('/complaints', form)
      .then(() => {
        setForm({ title: '', description: '' });
        load();
      })
      .catch(() => setError('Failed to submit complaint.'));
  }

  const columns = [
    { key: 'title', label: 'Complaint' },
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
  ];
  const rows = complaints.map((c) => ({
    id: c.id,
    title: c.title,
    status: c.status,
    priority: c.priority,
  }));

  return (
    <div>
      <h2 className="page-title">Complaints</h2>
      <p className="page-subtitle">Raise complaints, track progress, and view resolved issues.</p>

      <div className="dashboard-grid">
        <DashboardCard title="Raise a Complaint">
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g., Lift not working"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                style={{ minHeight: 110, resize: 'vertical' }}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe the issue in detail…"
              />
              {error && <div className="form-error">{error}</div>}
            </div>
            <button className="btn-primary" type="submit">
              Submit
            </button>
          </form>
        </DashboardCard>

        <DashboardCard title="Recent Complaints" subtitle="Across your society">
          <Table columns={columns} rows={rows} />
        </DashboardCard>
      </div>
    </div>
  );
}

