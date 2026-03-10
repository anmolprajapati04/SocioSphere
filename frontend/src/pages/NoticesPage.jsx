import { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState('');

  function load() {
    api
      .get('/notices')
      .then((r) => setNotices(r.data || []))
      .catch(() => setNotices([]));
  }

  useEffect(() => {
    load();
  }, []);

  function submit(e) {
    e.preventDefault();
    if (!form.title || !form.content) {
      setError('Title and content are required.');
      return;
    }
    setError('');
    api
      .post('/notices', form)
      .then(() => {
        setForm({ title: '', content: '' });
        load();
      })
      .catch(() => setError('Failed to publish notice.'));
  }

  return (
    <div>
      <h2 className="page-title">Notices</h2>
      <p className="page-subtitle">Post announcements and important alerts for your society.</p>

      <div className="dashboard-grid">
        <DashboardCard title="Create Notice">
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g., Water supply maintenance"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                className="form-input"
                style={{ minHeight: 110, resize: 'vertical' }}
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                placeholder="Write your announcement…"
              />
              {error && <div className="form-error">{error}</div>}
            </div>
            <button className="btn-primary" type="submit">
              Publish
            </button>
          </form>
        </DashboardCard>

        <DashboardCard title="Latest Notices" subtitle="Most recent first">
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            {notices.map((n) => (
              <div key={n.id} style={{ padding: '0.7rem 0.8rem', border: '1px solid #e5e7eb', borderRadius: '0.9rem' }}>
                <div style={{ fontWeight: 600 }}>{n.title}</div>
                <div style={{ fontSize: '0.9rem', color: '#4b5563', marginTop: '0.15rem' }}>{n.content}</div>
              </div>
            ))}
            {!notices.length && <div style={{ color: '#6b7280' }}>No notices yet.</div>}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

