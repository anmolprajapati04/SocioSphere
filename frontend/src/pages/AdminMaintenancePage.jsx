import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, AlertCircle, CheckCircle2, Search, Filter, TrendingUp, DollarSign } from 'lucide-react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function AdminMaintenancePage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, PAID, PENDING
  const [recordingId, setRecordingId] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get('/maintenance/payments')
      .then((r) => setPayments(r.data.data || r.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleRecordPayment = async (id) => {
    setRecordingId(id);
    try {
      await api.post(`/maintenance/payments/${id}/record`, { remarks: 'Manually recorded by Admin' });
      load();
    } catch (err) {
      alert('Failed to record payment');
    } finally {
      setRecordingId(null);
    }
  };

  const filteredPayments = payments.filter(p => {
    const matchesFilter = filter === 'ALL' || p.status === filter;
    const matchesSearch = p.Resident?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.Resident?.flat_number?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalCollected = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalPending = payments.filter(p => p.status !== 'PAID').reduce((sum, p) => sum + parseFloat(p.amount), 0);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Financial Overview</span>
          </motion.div>
          <h2 className="text-4xl font-black text-primary-900 tracking-tighter">Society Maintenance</h2>
          <p className="text-slate-500 font-medium">Track collections, manage dues, and record manual payments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard className="p-6 flex items-center gap-6 bg-white border border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
             <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Collected</p>
            <h3 className="text-2xl font-black text-emerald-600 tracking-tighter">₹ {totalCollected.toLocaleString()}</h3>
          </div>
        </DashboardCard>
        <DashboardCard className="p-6 flex items-center gap-6 bg-white border border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
             <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pending</p>
            <h3 className="text-2xl font-black text-amber-500 tracking-tighter">₹ {totalPending.toLocaleString()}</h3>
          </div>
        </DashboardCard>
        <DashboardCard className="p-6 flex items-center gap-6 bg-white border border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
             <CreditCard className="w-8 h-8" />
          </div>
          <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Overall Collection Rate</p>
             <h3 className="text-2xl font-black text-indigo-600 tracking-tighter">
               {payments.length ? Math.round((totalCollected / (totalCollected + totalPending)) * 100) : 0}%
             </h3>
          </div>
        </DashboardCard>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex gap-2">
            {['ALL', 'PENDING', 'PAID'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === f 
                    ? 'bg-primary-900 text-white shadow-md' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search resident or flat..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 ring-indigo-500/20 transition-all outline-none" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc] text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-l-xl">Resident Info</th>
                <th className="px-6 py-4">Bill Details</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{p.Resident?.name || 'Unknown'}</div>
                    <div className="text-xs text-slate-500 mt-1">Flat {p.Resident?.flat_number || 'N/A'} • {p.Resident?.phone || ''}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-700">Bill #{p.id}</div>
                    <div className="text-xs text-slate-500">Due: {new Date(p.due_date).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-lg">₹{parseFloat(p.amount).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={p.status === 'PAID' ? 'success' : 'warning'}>{p.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {p.status !== 'PAID' && (
                      <Button 
                        onClick={() => handleRecordPayment(p.id)}
                        disabled={recordingId === p.id}
                        className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 shadow-sm"
                      >
                        {recordingId === p.id ? 'Recording...' : 'Record Payment'}
                      </Button>
                    )}
                    {p.status === 'PAID' && (
                       <span className="text-xs font-bold text-emerald-500 flex items-center justify-end gap-1">
                         <CheckCircle2 className="w-4 h-4" /> Settled
                       </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    <p className="font-semibold">No records found matching your criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
