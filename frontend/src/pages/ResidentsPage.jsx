import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import SearchBar from '../components/SearchBar';
import Table from '../components/Table';
import '../styles/dashboard.css';

export default function ResidentsPage() {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get('/residents')
      .then((r) => setRows(r.data || []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const name = r.User?.name || '';
      const email = r.User?.email || '';
      return `${name} ${email} ${r.flat_number}`.toLowerCase().includes(q);
    });
  }, [rows, query]);

  const columns = [
    { key: 'name', label: 'Resident' },
    { key: 'email', label: 'Email' },
    { key: 'flat', label: 'Flat' },
    { key: 'owner', label: 'Owner' },
  ];

  const tableRows = filtered.map((r) => ({
    id: r.id,
    name: r.User?.name,
    email: r.User?.email,
    flat: r.flat_number,
    owner: r.is_owner ? 'Yes' : 'No',
  }));

  return (
    <div>
      <h2 className="page-title">Residents</h2>
      <p className="page-subtitle">Search residents, view flat details, and manage society members.</p>

      <DashboardCard title="Resident Directory" subtitle={loading ? 'Loading…' : `${tableRows.length} records`}>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '0.8rem' }}>
          <div style={{ flex: 1 }}>
            <SearchBar placeholder="Search by name, email, flat…" value={query} onChange={setQuery} />
          </div>
          <button className="btn-primary" style={{ width: 'auto' }} type="button">
            Add Resident
          </button>
        </div>
        <Table columns={columns} rows={tableRows} />
      </DashboardCard>
    </div>
  );
}

