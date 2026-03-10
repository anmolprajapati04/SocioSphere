import { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import Table from '../components/Table';

export default function MaintenancePage() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api
      .get('/maintenance/payments')
      .then((r) => setPayments(r.data || []))
      .catch(() => setPayments([]));
  }, []);

  const columns = [
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' },
    { key: 'due', label: 'Due Date' },
  ];

  const rows = payments.map((p) => ({
    id: p.id,
    amount: `₹ ${p.amount}`,
    status: p.status,
    due: p.due_date,
  }));

  return (
    <div>
      <h2 className="page-title">Maintenance</h2>
      <p className="page-subtitle">Monthly bills, payment history, and pending dues.</p>
      <DashboardCard title="Payments" subtitle="Latest payments and dues">
        <Table columns={columns} rows={rows} />
      </DashboardCard>
    </div>
  );
}

