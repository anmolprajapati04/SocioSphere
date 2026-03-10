import { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import Table from '../components/Table';

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState([]);

  function load() {
    api
      .get('/visitors')
      .then((r) => setVisitors(r.data || []))
      .catch(() => setVisitors([]));
  }

  useEffect(() => {
    load();
  }, []);

  const columns = [
    { key: 'name', label: 'Visitor' },
    { key: 'purpose', label: 'Purpose' },
    { key: 'status', label: 'Status' },
  ];

  const rows = visitors.map((v) => ({
    id: v.id,
    name: v.name,
    purpose: v.purpose || '-',
    status: v.status,
  }));

  return (
    <div>
      <h2 className="page-title">Visitors</h2>
      <p className="page-subtitle">Visitor entry log, approvals, and daily analytics.</p>
      <DashboardCard title="Visitor Log" subtitle="Latest first">
        <Table columns={columns} rows={rows} />
      </DashboardCard>
    </div>
  );
}

