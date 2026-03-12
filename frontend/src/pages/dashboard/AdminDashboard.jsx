import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { 
  Users, 
  AlertCircle, 
  TrendingUp, 
  CreditCard,
  UserPlus,
  FileText,
  Settings,
  MoreVertical,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import NoticeBoard from '../../components/NoticeBoard';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

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
    opacity: 1
  }
};

const AdminDashboard = () => {
  const { user: authUser, societyId: authSocietyId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    residentsCount: 0,
    maintenanceRevenue: 0,
    complaintStats: [],
    visitorAnalytics: { today: 0 },
    paymentDefaulters: 0,
    complaints: [],
    notices: [],
    totalComplaints: 0
  });
  const [residents, setResidents] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [showResModal, setShowResModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [detailsType, setDetailsType] = useState(null); // 'residents', 'collection', 'complaints', 'defaulters'
  const [detailsData, setDetailsData] = useState([]);
  const [adminResponse, setAdminResponse] = useState('');
  const [resStatus, setResStatus] = useState('PENDING');
  
  const [newResident, setNewResident] = useState({ name: '', email: '', phone: '', wing: '', flat: '', isOwner: true });
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });

  const fetchData = async () => {
    try {
      const [dashResp, resResp, compResp, noticeResp, growthResp] = await Promise.all([
        api.get('/dashboard'),
        api.get('/residents'),
        api.get('/complaints'),
        api.get('/notices'),
        api.get('/dashboard/growth')
      ]);
      setData({ ...dashResp.data, complaints: compResp.data, notices: noticeResp.data });
      setResidents(resResp.data);
      setGrowthData(growthResp.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = async (type) => {
    setDetailsType(type);
    try {
      if (type === 'residents') {
        setDetailsData(residents);
      } else if (type === 'collection') {
        const resp = await api.get('/maintenance/payments?status=PAID');
        setDetailsData(resp.data);
      } else if (type === 'complaints') {
        setDetailsData(data.complaints);
      } else if (type === 'defaulters') {
        const resp = await api.get('/maintenance/payments?status=OVERDUE');
        setDetailsData(resp.data);
      }
    } catch (err) {
      console.error('Failed to fetch details:', err);
    }
  };

  useEffect(() => {
    fetchData();
    
    const socket = io('http://localhost:5000');
    
    socket.on('new_complaint', (complaint) => {
      if (complaint.society_id === authUser?.society_id) {
        fetchData();
      }
    });

    socket.on('new_notice', (notice) => {
      if (notice.society_id === authUser?.society_id) {
        fetchData();
      }
    });

    socket.on('new_visitor', () => {
       fetchData();
    });

    return () => socket.disconnect();
  }, [authUser?.society_id]);

  const handleAddResident = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', {
        name: newResident.name,
        email: newResident.email,
        phone: newResident.phone,
        password: 'Password123!',
        role: 'Resident',
        wing: newResident.wing,
        flat_number: newResident.flat,
        is_owner: newResident.isOwner,
        society_id: newResident.society_id || authSocietyId || authUser?.society_id || data.society_id
      });
      setShowResModal(false);
      fetchData();
      alert('Resident enrolled successfully with default password: Password123!');
      setNewResident({ name: '', email: '', phone: '', wing: '', flat: '', isOwner: true });
    } catch (err) {
      alert(err.response?.data?.message || 'Error executing enrollment');
    }
  };

  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/complaints/${selectedComplaint.id}`, {
        status: resStatus,
        admin_response: adminResponse
      });
      setSelectedComplaint(null);
      setAdminResponse('');
      fetchData();
      alert('Resolution deployed and broadcasted.');
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating complaint. Please verify if the record still exists or if network is stable.');
    }
  };

  const handlePostNotice = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notices', newNotice);
      setShowNoticeModal(false);
      fetchData();
      alert('Strategic broadcast deployed successfully');
      setNewNotice({ title: '', content: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error deploying notice');
    }
  };

  const stats = [
    { label: 'Total Residents', value: data.residentsCount, icon: Users, trend: '+0.0%', up: true, type: 'residents' },
    { label: 'Collection (PAID)', value: `₹${(data.maintenanceRevenue / 1000).toFixed(1)}k`, icon: TrendingUp, trend: '+0.0%', up: true, type: 'collection' },
    { label: 'Total Complaints', value: data.totalComplaints, icon: AlertCircle, trend: `+${data.complaintStats.find(s => s.status === 'PENDING')?.count || 0}`, up: false, type: 'complaints' },
    { label: 'Defaulters', value: data.paymentDefaulters, icon: CreditCard, trend: '0%', up: false, type: 'defaulters' },
  ];

  const collectionData = {
    labels: ['Maintenance', 'Amenities', 'Fine', 'Others'],
    datasets: [{
      data: [65, 15, 10, 10],
      backgroundColor: ['#0F172A', '#FACC15', '#10B981', '#cbd5e1'],
      borderWidth: 0,
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
             Command <span className="text-gold-500">Center</span>
           </h1>
           <div className="flex items-center gap-4 mt-4">
              <span className="w-12 h-1 bg-gold-500 rounded-full" />
              <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-[10px]">Strategic Management Interface • Royal Palms</p>
           </div>
        </div>
        <div className="flex gap-6">
           <Button 
             onClick={() => setShowResModal(true)}
             className="px-10 h-16 bg-white border border-slate-200 text-elegant-gold font-black flex items-center gap-3 hover:bg-elegant-gold hover:text-primary-900 transition-all duration-500 rounded-2xl group shadow-sm"
           >
              <UserPlus className="w-6 h-6 group-hover:rotate-12 transition-transform" /> ENROLL RESIDENT
           </Button>
           <Button 
             onClick={() => setShowNoticeModal(true)}
             className="px-10 h-16 bg-elegant-gold text-primary-900 font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all rounded-2xl shadow-xl shadow-elegant-gold/20"
           >
              <FileText className="w-6 h-6" /> BROADCAST DATA
           </Button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card 
              onClick={() => handleShowDetails(s.type)}
              className="luxury-card p-10 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex justify-between items-start mb-8 relative z-10">
                 <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-elegant-gold group-hover:bg-elegant-gold group-hover:text-primary-900 transition-all duration-500 shadow-sm border border-slate-100">
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
      <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-10">
         <Card className="luxury-card p-10 lg:col-span-2">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="text-3xl font-black text-primary-900 tracking-tighter uppercase italic">Strategic <span className="text-gold-500">Growth</span></h3>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Maintenance Revenue Matrix</p>
               </div>
               <div className="flex gap-2">
                 {['D', 'W', 'M', 'Y'].map(t => (
                   <button key={t} className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[10px] font-black text-slate-500 hover:text-elegant-gold transition-colors uppercase">{t}</button>
                 ))}
               </div>
            </div>
            <div className="h-[350px]">
               {growthData.length > 0 ? (
                 <Bar 
                   data={{
                     labels: growthData.map(d => d.month),
                     datasets: [{
                       label: 'Revenue',
                       data: growthData.map(d => d.total),
                       backgroundColor: '#0F172A',
                       borderRadius: 12,
                       barThickness: 40
                     }]
                   }}
                   options={{
                     responsive: true,
                     maintainAspectRatio: false,
                     plugins: {
                       legend: { display: false },
                       tooltip: {
                         backgroundColor: '#0F172A',
                         titleFont: { family: 'Inter', size: 12, weight: 'bold' },
                         bodyFont: { family: 'Inter', size: 12 },
                         padding: 12,
                         displayColors: false
                       }
                     },
                     scales: {
                       y: { grid: { display: false }, ticks: { font: { size: 10, weight: 'bold' } } },
                       x: { grid: { display: false }, ticks: { font: { size: 10, weight: 'bold' } } }
                     }
                   }}
                 />
               ) : (
                 <div className="h-full flex items-center justify-center italic text-slate-800 font-black bg-slate-50/50 rounded-3xl border border-slate-200 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]" />
                    <div className="flex flex-col items-center gap-4 relative z-10">
                       <TrendingUp className="w-16 h-16 text-slate-900 animate-pulse" />
                       <span className="uppercase tracking-[0.4em] text-[10px] text-slate-600">No Growth Data Available</span>
                    </div>
                 </div>
               )}
            </div>
         </Card>

         <Card className="luxury-card p-12 flex flex-col items-center justify-center relative">
            <h3 className="text-2xl font-black text-primary-900 tracking-tighter mb-4 w-full uppercase italic">Alert <span className="text-gold-500">Board</span></h3>
            <NoticeBoard notices={data.notices} loading={loading} />
         </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-12">
        <Card className="luxury-card overflow-hidden">
           <div className="p-12 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-3xl font-black text-primary-900 tracking-tighter uppercase italic">Resolution <span className="text-gold-500">Terminal</span></h3>
              <div className="flex gap-4">
                 <Badge variant="warning" className="px-5 py-2 rounded-xl text-[10px] font-black tracking-[0.2em] animate-pulse">PENDING AUDIT</Badge>
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                    <tr>
                       <th className="px-12 py-8">Subject / Identity</th>
                       <th className="px-12 py-8">Metric</th>
                       <th className="px-12 py-8 text-right">Process</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {data.complaints?.slice(0, 5).map((c, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                         <td className="px-12 py-10">
                            <div className="font-black text-primary-900 text-lg group-hover:text-gold-500 transition-colors uppercase italic">{c.title}</div>
                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-2">{c.User?.name || `Resident Node #${c.resident_id}`} • {c.User?.flat_number || 'N/A'} • Priority {c.priority}</div>
                         </td>
                         <td className="px-12 py-10">
                            <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg inline-block
                              ${c.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gold-500/10 text-gold-500'}`}>
                               {c.status}
                            </div>
                         </td>
                         <td className="px-12 py-10 text-right">
                            <Button 
                               onClick={() => setSelectedComplaint(c)}
                               className="px-8 h-12 bg-white border border-slate-200 shadow-sm text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-gold-500 hover:text-gold-500 transition-all"
                            >OPEN ACCESS</Button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </Card>
      </motion.div>

      {/* Details Drill-down Modal */}
      <Modal 
        isOpen={!!detailsType} 
        onClose={() => setDetailsType(null)} 
        title={`${detailsType?.toUpperCase()} DETAILS`}
        className="max-w-4xl bg-white"
      >
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
          {detailsType === 'residents' && detailsData.map((r, i) => (
            <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-gold-500/30 transition-all">
              <div>
                <div className="font-black text-primary-900 uppercase italic">{r.User?.name}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{r.wing}-{r.flat_number} • {r.User?.phone}</div>
              </div>
              <Badge variant={r.is_owner ? 'success' : 'neutral'}>{r.is_owner ? 'OWNER' : 'TENANT'}</Badge>
            </div>
          ))}

          {(detailsType === 'collection' || detailsType === 'defaulters') && detailsData.map((p, i) => (
            <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-gold-500/30 transition-all">
              <div>
                <div className="font-black text-primary-900 uppercase italic">{p.Resident?.name}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Flat {p.Resident?.flat_number} • Bill ID #{p.id}</div>
              </div>
              <div className="text-right">
                <div className="font-black text-primary-900">₹{p.amount}</div>
                <div className={`text-[10px] font-black tracking-widest ${p.status === 'PAID' ? 'text-emerald-500' : 'text-rose-500'}`}>{p.status}</div>
              </div>
            </div>
          ))}

          {detailsType === 'complaints' && detailsData.map((c, i) => (
            <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 group hover:border-gold-500/30 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-black text-primary-900 uppercase italic">{c.title}</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">By: {c.User?.name || 'Resident'} ({c.User?.flat_number || 'N/A'}) • Priority: {c.priority}</div>
                </div>
                <Badge variant={c.status === 'RESOLVED' ? 'success' : 'warning'}>{c.status}</Badge>
              </div>
              <p className="text-sm text-slate-600 font-medium">{c.description}</p>
            </div>
          ))}
          
          {detailsData.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">No records discovered in this sector</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Modals Overhaul */}
      <Modal isOpen={!!selectedComplaint} onClose={() => setSelectedComplaint(null)} title="Resolution Terminal" className="max-w-2xl bg-white border border-white/10">
         {selectedComplaint && (
           <form onSubmit={handleUpdateComplaint} className="space-y-8">
              <div className="p-6 bg-slate-50 rounded-3xl border border-white/5">
                 <h4 className="text-gold-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Original Report</h4>
                 <p className="text-primary-900 font-bold leading-relaxed">{selectedComplaint.description}</p>
              </div>
              
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Execution status</label>
                 <div className="grid grid-cols-3 gap-3">
                    {['PENDING', 'IN_PROGRESS', 'RESOLVED'].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setResStatus(s)}
                        className={`py-4 rounded-xl text-[10px] font-black transition-all border ${
                          resStatus === s ? 'bg-gold-500 text-slate-950 border-gold-500 shadow-lg shadow-gold-500/20' : 'bg-slate-900 text-slate-500 border-white/5'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Administrative Response</label>
                 <textarea 
                   rows="4"
                   placeholder="Enter formal response for the resident..."
                   value={adminResponse}
                   onChange={e => setAdminResponse(e.target.value)}
                   className="input-luxury min-h-[150px] resize-none"
                   required
                 />
              </div>

              <Button type="submit" className="w-full btn-luxury uppercase h-20 text-lg italic shadow-2xl">Deploy Resolution</Button>
           </form>
         )}
      </Modal>

      <Modal isOpen={showResModal} onClose={() => setShowResModal(false)} title="Registry Enrollment" className="bg-white">
         <form onSubmit={handleAddResident} className="space-y-6">
            <Input label="Registry Identity" placeholder="Full legal name" value={newResident.name} onChange={e => setNewResident({...newResident, name: e.target.value})} className="input-luxury" required />
            <Input label="Digital Primary" type="email" placeholder="official@access.com" value={newResident.email} onChange={e => setNewResident({...newResident, email: e.target.value})} className="input-luxury" required />
            <Input label="Contact Matrix" placeholder="+91 XXXXX XXXXX" value={newResident.phone} onChange={e => setNewResident({...newResident, phone: e.target.value})} className="input-luxury" required />
            <Input label="Society Protocol ID" placeholder="Society ID" value={newResident.society_id || authUser?.society_id || ''} onChange={e => setNewResident({...newResident, society_id: e.target.value})} className="input-luxury" required />
            <div className="grid grid-cols-2 gap-6">
               <Input label="Sector" placeholder="Wing" value={newResident.wing} onChange={e => setNewResident({...newResident, wing: e.target.value})} className="input-luxury" />
               <Input label="Node" placeholder="Flat No." value={newResident.flat} onChange={e => setNewResident({...newResident, flat: e.target.value})} className="input-luxury" />
            </div>
            <div className="flex items-center gap-6 py-4">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Contractual Type</span>
               <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-white/5 flex-1">
                  {['Landlord', 'Leasee'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewResident({...newResident, isOwner: t === 'Landlord'})}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${
                        (t === 'Landlord') === newResident.isOwner ? 'bg-gold-500 text-slate-950 shadow-lg' : 'text-slate-500'
                      }`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
               </div>
            </div>
            <Button type="submit" className="w-full btn-luxury uppercase h-20 text-lg">Execute Enrollment</Button>
         </form>
      </Modal>

      <Modal isOpen={showNoticeModal} onClose={() => setShowNoticeModal(false)} title="Strategic Broadcast" className="bg-white">
         <form onSubmit={handlePostNotice} className="space-y-8">
            <Input label="Broadcast Header" placeholder="Strategic objective header" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} className="input-luxury" />
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Data content</label>
               <textarea 
                 rows="6"
                 placeholder="Detailed broadcast parameters..."
                 value={newNotice.content}
                 onChange={e => setNewNotice({...newNotice, content: e.target.value})}
                 className="input-luxury min-h-[200px] resize-none"
               />
            </div>
            <Button type="submit" className="w-full btn-luxury uppercase h-20 text-lg">Initiate Broadcast</Button>
         </form>
      </Modal>
    </motion.div>
  );
};

export default AdminDashboard;
