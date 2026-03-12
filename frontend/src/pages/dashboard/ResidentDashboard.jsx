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

  const fetchData = async () => {
    try {
      const [compResp, noticeResp] = await Promise.all([
        api.get('/complaints'),
        api.get('/notices')
      ]);
      setComplaints(compResp.data);
      setNotices(noticeResp.data);
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

  const handlePaymentSimulation = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      alert('Maintenance Paid Successfully! Receipts sent to mail.');
    }, 2000);
  };

  const stats = [
    { label: 'Pending Dues', value: '₹0.00', icon: CreditCard, trend: 'SECURE' },
    { label: 'Gate Pass', value: 'ACTIVE', icon: ShieldCheck, trend: 'VERIFIED' },
    { label: 'Reports', value: complaints.filter(c => c.status !== 'RESOLVED').length, icon: AlertCircle, trend: 'PRIORITY' },
    { label: 'Residence', value: user?.role === 'RESIDENT' ? 'B-402' : 'ADMIN', icon: Users, trend: 'PLATINUM' },
  ];

  const maintenanceData = {
    labels: ['OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR'],
    datasets: [{
      label: 'Energy (kWh)',
      data: [120, 190, 150, 170, 140, 130],
      backgroundColor: '#D4AF37',
      borderRadius: 20,
      barThickness: 12
    }]
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-10 space-y-12 bg-slate-50 min-h-screen text-slate-800"
    >
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div>
           <h1 className="text-6xl font-black text-primary-900 tracking-tighter uppercase italic">
             Concierge <span className="text-gold-500">Portal</span>
           </h1>
           <div className="flex items-center gap-4 mt-4">
              <span className="w-12 h-1 bg-gold-500 rounded-full" />
              <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-[10px]">Royal Palms • Premier Resident Interface</p>
           </div>
        </div>
        <div className="flex gap-6">
           <Button 
             onClick={handlePaymentSimulation}
             disabled={paying}
             className="px-10 h-16 bg-white border border-slate-200 text-elegant-gold font-black flex items-center gap-3 hover:bg-elegant-gold hover:text-primary-900 transition-all duration-500 rounded-2xl group shadow-sm"
           >
              <CreditCard className="w-6 h-6 group-hover:rotate-12 transition-transform" /> {paying ? 'VERIFYING...' : 'CLEAR DUES'}
           </Button>
           <Button 
             onClick={() => setShowCompModal(true)}
             className="px-10 h-16 bg-elegant-gold text-primary-900 font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all rounded-2xl shadow-xl shadow-elegant-gold/20"
           >
              <Plus className="w-6 h-6" /> LODGE REPORT
           </Button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="luxury-card p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex justify-between items-start mb-8 relative z-10">
                 <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-elegant-gold group-hover:bg-elegant-gold group-hover:text-primary-900 transition-all duration-500 border border-slate-200 shadow-sm">
                    <s.icon className="w-7 h-7" />
                 </div>
                 <div className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-full border border-white/10 text-slate-400`}>
                    {s.trend}
                 </div>
              </div>
              <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2">{s.label}</p>
              <h3 className="text-4xl font-black text-primary-900 tracking-tighter">
                {loading ? '---' : s.value}
              </h3>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="luxury-card p-10 relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px]" />
             <div className="relative z-10">
                <div className="flex justify-between items-center mb-10">
                   <div>
                      <h3 className="text-3xl font-black text-primary-900 tracking-tighter uppercase italic">Resource <span className="text-gold-500">Matrix</span></h3>
                      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Utility Consumption Analysis</p>
                   </div>
                   <div className="flex gap-2">
                     {['M', 'Y'].map(t => (
                       <button key={t} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[10px] font-black text-slate-500 hover:text-elegant-gold transition-colors uppercase shadow-sm">{t}</button>
                     ))}
                   </div>
                </div>
                <div className="h-[300px]">
                   <Bar data={maintenanceData} options={{ 
                     responsive: true, 
                     maintainAspectRatio: false,
                     plugins: { legend: { display: false } },
                     scales: { 
                        y: { 
                          grid: { color: 'rgba(255,255,255,0.05)' },
                          ticks: { color: '#64748b', font: { weight: 'bold', size: 10 } }
                        }, 
                        x: { 
                          grid: { display: false },
                          ticks: { color: '#64748b', font: { weight: 'bold', size: 10 } }
                        } 
                     }
                   }} />
                </div>
             </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="luxury-card p-10">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-primary-900 tracking-tighter uppercase italic">Society <span className="text-gold-500">Alerts</span></h3>
                <Bell className="w-5 h-5 text-gold-500 animate-bounce" />
             </div>
             
             <NoticeBoard notices={notices} loading={loading} />

             <Button className="w-full mt-10 h-16 bg-slate-50 border border-slate-200 shadow-sm text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:border-elegant-gold hover:text-elegant-gold transition-all">VIEW ARCHIVE</Button>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="luxury-card overflow-hidden">
           <div className="p-12 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-3xl font-black text-primary-900 tracking-tighter uppercase italic">Personal <span className="text-gold-500">Reports</span></h3>
              <div className="relative group">
                 <Search className="w-6 h-6 absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-gold-500 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search reports..." 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   className="h-16 pl-16 pr-8 bg-slate-50 border border-white/5 rounded-2xl text-sm font-bold text-primary-900 w-80 focus:ring-2 ring-gold-500/20 transition-all outline-none" 
                 />
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                    <tr>
                       <th className="px-12 py-8">Topic / Ident</th>
                       <th className="px-12 py-8">Status</th>
                       <th className="px-12 py-8">Admin Feedback</th>
                       <th className="px-12 py-8 text-right">Data</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {complaints.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).map(c => (
                      <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                         <td className="px-12 py-10">
                            <div className="font-black text-primary-900 text-lg group-hover:text-gold-500 transition-colors uppercase italic">{c.title}</div>
                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-2">PRIORITY: {c.priority}</div>
                         </td>
                         <td className="px-12 py-10">
                            <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg inline-block
                              ${c.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gold-500/10 text-gold-500'}`}>
                               {c.status.replace('_', ' ')}
                            </div>
                         </td>
                         <td className="px-12 py-10">
                            {c.admin_response ? (
                               <div className="text-slate-400 text-sm font-bold border-l-2 border-gold-500 pl-4 py-1 italic max-w-md">
                                  {c.admin_response}
                               </div>
                            ) : (
                               <div className="text-slate-600 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                                  <Clock className="w-3 h-3" /> Awaiting Protocol
                               </div>
                            )}
                         </td>
                         <td className="px-12 py-10 text-right">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                               {new Date(c.createdAt).toLocaleDateString()}
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
              {complaints.length === 0 && !loading && (
                 <div className="p-32 text-center flex flex-col items-center gap-6">
                   <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-slate-700">
                      <AlertCircle className="w-10 h-10" />
                   </div>
                   <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-xs">Clear Matrix • No Active Reports</p>
                 </div>
              )}
           </div>
        </Card>
      </motion.div>

      <Modal isOpen={showCompModal} onClose={() => setShowCompModal(false)} title="Strategic Report Lodge" className="bg-white">
         <form onSubmit={handleRaiseComplaint} className="space-y-8">
            <Input label="Report Subject" placeholder="Strategic header of issue" value={newComplaint.title} onChange={e => setNewComplaint({...newComplaint, title: e.target.value})} className="input-luxury" />
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Objective detail</label>
               <textarea 
                 rows="6"
                 placeholder="Provide detailed environmental parameters..."
                 value={newComplaint.description}
                 onChange={e => setNewComplaint({...newComplaint, description: e.target.value})}
                 className="input-luxury min-h-[200px] resize-none"
               />
            </div>
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Priority scale</label>
               <div className="grid grid-cols-3 gap-3">
                  {['LOW', 'MEDIUM', 'HIGH'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewComplaint({...newComplaint, priority: p})}
                      className={`py-4 rounded-xl text-[10px] font-black transition-all border ${
                        p === newComplaint.priority ? 'bg-gold-500 text-slate-950 border-gold-500 shadow-lg' : 'bg-slate-900 text-slate-500 border-white/5'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
               </div>
            </div>
            <Button type="submit" className="w-full btn-luxury uppercase h-20 text-lg shadow-2xl">Execute Lodge</Button>
         </form>
      </Modal>
    </motion.div>
  );
};

export default ResidentDashboard;
