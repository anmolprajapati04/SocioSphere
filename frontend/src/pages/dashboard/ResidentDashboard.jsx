import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { 
  CreditCard, 
  MessageSquare, 
  Users, 
  Calendar, 
  Bell, 
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Search,
  Plus
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import NoticeBoard from '../../components/NoticeBoard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const ResidentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [showCompModal, setShowCompModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newComplaint, setNewComplaint] = useState({ title: '', description: '', priority: 'MEDIUM' });
  const [paying, setPaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [utilityData, setUtilityData] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const fetchData = async () => {
    try {
      const [compResp, noticeResp, usageResp, payResp] = await Promise.all([
        api.get('/complaints'),
        api.get('/notices'),
        api.get('/maintenance/usage'),
        api.get('/maintenance/payments')
      ]);
      setComplaints(compResp.data);
      setNotices(noticeResp.data);
      setUtilityData(usageResp.data);
      setPendingPayments(payResp.data.filter(p => p.status !== 'PAID'));
    } catch (err) {
      console.error('Failed to fetch resident data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const socket = io('http://localhost:5000');
    
    socket.on('new_notice', (notice) => {
      if (notice.society_id === user?.society_id) {
        setNotices(prev => [notice, ...prev]);
        // Optional: show a toast or alert
      }
    });

    socket.on('complaint_update', (complaint) => {
      if (complaint.resident_id === user?.id) {
        fetchData();
        alert(`Your report "${complaint.title}" has been updated: ${complaint.status}`);
      }
    });

    return () => socket.disconnect();
  }, [user?.id, user?.society_id]);

  const handleRaiseComplaint = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', newComplaint);
      setShowCompModal(false);
      setNewComplaint({ title: '', description: '', priority: 'MEDIUM' });
      fetchData();
      alert('Report lodged successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Error executing lodge');
    }
  };

  const handlePayment = async (paymentId) => {
    setPaying(true);
    try {
      const res = await api.post(`/maintenance/payments/${paymentId}/pay`);
      alert(res.data.message);
      setShowPayModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  const pendingAmount = pendingPayments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const stats = [
    { 
      label: 'Pending Dues', 
      value: `₹${pendingAmount.toFixed(2)}`, 
      icon: CreditCard, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50', 
      status: pendingAmount > 0 ? 'Action Required' : 'Up to date' 
    },
    { label: 'Gate Pass', value: 'ACTIVE', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', status: 'Verified' },
    { label: 'My Reports', value: complaints.filter(c => c.status !== 'RESOLVED').length, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', status: 'Pending' },
    { 
      label: 'Residence', 
      value: user?.flat_number || 'N/A', 
      icon: Users, 
      color: 'text-slate-600', 
      bg: 'bg-slate-50', 
      status: `Wing ${user?.wing || '-'}`,
      onClick: () => setShowProfileModal(true)
    },
  ];

  const maintenanceData = {
    labels: utilityData.map(d => d.month),
    datasets: [
      {
        label: 'Electricity (kWh)',
        data: utilityData.map(d => d.electricity),
        backgroundColor: '#4f46e5',
        borderRadius: 6,
      },
      {
        label: 'Water (L)',
        data: utilityData.map(d => d.water),
        backgroundColor: '#10b981',
        borderRadius: 6,
      },
      {
        label: 'LPG (Units)',
        data: utilityData.map(d => d.lpg),
        backgroundColor: '#f59e0b',
        borderRadius: 6,
      }
    ]
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-8 space-y-8 bg-[#f8fafc] min-h-screen text-slate-800"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Resident Dashboard</h1>
          <p className="text-slate-500 font-medium">{user?.society_name || 'Society'} • Resident Portal</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowPayModal(true)}
            disabled={pendingAmount === 0}
            className="px-6 h-12 bg-white border border-slate-200 text-slate-700 font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all rounded-xl shadow-sm disabled:opacity-50"
          >
            <CreditCard className="w-5 h-5" /> Pay Dues
          </Button>
          <Button 
            onClick={() => setShowCompModal(true)}
            className="px-6 h-12 bg-indigo-600 text-white font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-all rounded-xl shadow-md shadow-indigo-100"
          >
            <Plus className="w-5 h-5" /> Lodge Report
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card 
              onClick={s.onClick}
              className={`p-6 transition-all border-slate-100 group ${s.onClick ? 'cursor-pointer hover:shadow-lg' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md">
                  {s.status}
                </div>
              </div>
              <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider mb-1">{s.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {loading ? '...' : s.value}
              </h3>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Consumption Analysis</h3>
                <p className="text-slate-500 text-sm font-medium">Monthly utility usage matrix</p>
              </div>
              <div className="flex gap-2">
                {['M', 'Y'].map(t => (
                  <button key={t} className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors uppercase">
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[300px]">
              <Bar data={maintenanceData} options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    display: true, 
                    position: 'bottom',
                    labels: { boxWidth: 12, font: { weight: '600', size: 10 } }
                  } 
                },
                scales: { 
                    y: { 
                      grid: { borderDash: [5, 5] },
                      ticks: { color: '#64748b', font: { weight: '600', size: 11 } }
                    }, 
                    x: { 
                      grid: { display: false },
                      ticks: { color: '#64748b', font: { weight: '600', size: 11 } }
                    } 
                }
              }} />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Society Notices</h3>
              <Badge variant="neutral" className="bg-indigo-50 text-indigo-600 border-none">Recent</Badge>
            </div>
            
            <NoticeBoard notices={notices} loading={loading} />

            <Button className="w-full mt-8 h-12 bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-100 transition-all">
              View All Notices
            </Button>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-white gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Personal Reports</h3>
              <p className="text-slate-500 text-sm font-medium">History of your lodged issues</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search reports..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 ring-indigo-500/20 transition-all outline-none" 
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f8fafc] text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-4">Topic / Identity</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Management Response</th>
                  <th className="px-8 py-4 text-right">Filed On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-900">{c.title}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Priority: {c.priority}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${c.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-xs font-semibold text-slate-700">{c.status.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {c.admin_response ? (
                        <div className="text-slate-600 text-sm font-medium border-l-2 border-indigo-500 pl-4 py-1 max-w-md">
                          {c.admin_response}
                        </div>
                      ) : (
                        <div className="text-slate-400 text-xs font-semibold italic flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" /> Awaiting action
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="text-xs font-semibold text-slate-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {complaints.length === 0 && !loading && (
              <div className="py-24 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <p className="text-slate-500 font-bold text-sm tracking-tight">No reports found</p>
                <p className="text-slate-400 text-xs mt-1">Lodge a new report to get started</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      <Modal isOpen={showCompModal} onClose={() => setShowCompModal(false)} title="Lodge New Report" className="bg-white">
        <form onSubmit={handleRaiseComplaint} className="space-y-5">
          <Input 
            label="Subject" 
            placeholder="e.g., Water leakage in Wing A" 
            value={newComplaint.title} 
            onChange={e => setNewComplaint({...newComplaint, title: e.target.value})} 
          />
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Description</label>
            <textarea 
              rows="6"
              placeholder="Provide more details about the issue..."
              value={newComplaint.description}
              onChange={e => setNewComplaint({...newComplaint, description: e.target.value})}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-indigo-500/20 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Priority Level</label>
            <div className="grid grid-cols-3 gap-3">
              {['LOW', 'MEDIUM', 'HIGH'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNewComplaint({...newComplaint, priority: p})}
                  className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                    p === newComplaint.priority ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full bg-indigo-600 text-white h-14 font-bold rounded-2xl mt-4 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            Submit Report
          </Button>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={showPayModal} onClose={() => setShowPayModal(false)} title="Maintenance Settlement" className="bg-white max-w-2xl">
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
            <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Resident Credentials</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Name</p>
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Residence</p>
                <p className="text-sm font-bold text-slate-900">Wing {user?.wing} • Flat {user?.flat_number}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Contact</p>
                <p className="text-sm font-bold text-slate-900">{user?.phone}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Email</p>
                <p className="text-sm font-bold text-slate-900">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Pending Invoices</h4>
            <div className="space-y-2">
              {pendingPayments.map(p => (
                <div key={p.id} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Maintenance Bill #{p.id}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase italic">{new Date(p.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">₹{parseFloat(p.amount).toLocaleString()}</p>
                    <Button 
                      onClick={() => handlePayment(p.id)}
                      disabled={paying}
                      className="mt-2 px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                    >
                      {paying ? 'Processing...' : 'Settle Now'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <p className="text-[11px] font-semibold text-emerald-700 leading-tight">
              Secure 256-bit encrypted transaction. Successful payments will be instantly reflected across society systems and a digital receipt will be emailed to you.
            </p>
          </div>
        </div>
      </Modal>

      {/* Residence Detail Modal */}
      <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} title="Residence Profile" className="bg-white">
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
              <Users className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
              <Badge variant="success" className="bg-indigo-50 text-indigo-600 border-none uppercase tracking-widest text-[10px]">{user?.role}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Society</p>
              <p className="text-sm font-bold text-slate-900">{user?.society_name || 'SocioSphere'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Unit Number</p>
              <p className="text-sm font-bold text-slate-900">{user?.wing}-{user?.flat_number}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Contact</p>
              <p className="text-sm font-bold text-slate-900">{user?.phone}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Account ID</p>
              <p className="text-sm font-bold text-slate-900">#{user?.id?.toString().padStart(6, '0')}</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[11px] text-slate-400 font-medium italic">Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default ResidentDashboard;
