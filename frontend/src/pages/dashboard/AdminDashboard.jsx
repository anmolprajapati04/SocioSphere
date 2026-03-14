import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import socket from '../../utils/socket';
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
  CheckCircle2,
  Bell
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
      setData({ 
        ...dashResp.data.data, 
        complaints: compResp.data.data || [], 
        notices: noticeResp.data.data || [] 
      });
      setResidents(resResp.data.data || []);
      setGrowthData(growthResp.data.data || []);
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
        setDetailsData(Array.isArray(residents) ? residents : []);
      } else if (type === 'collection') {
        const resp = await api.get('/maintenance/payments?status=PAID');
        setDetailsData(resp.data.data || []);
      } else if (type === 'complaints') {
        const resp = await api.get('/complaints');
        setDetailsData(resp.data.data || []);
      } else if (type === 'defaulters') {
        const resp = await api.get('/maintenance/payments?status=OVERDUE');
        setDetailsData(resp.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch details:', err);
    }
  };

  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  useEffect(() => {
    fetchData();

    if (authUser?.society_id) {
      console.log(`Joining society room: society_${authUser.society_id}`);
      socket.emit('join_society', authUser.society_id);
    }
    
    socket.on('new_complaint', (complaint) => {
      console.log('Received new_complaint:', complaint);
      if (complaint.society_id === authUser?.society_id) {
        addNotification(`📝 New complaint: "${complaint.title}"`);
        setData(prev => ({
          ...prev,
          complaints: [complaint, ...(prev.complaints || [])],
          totalComplaints: (prev.totalComplaints || 0) + 1
        }));
      }
    });

    socket.on('new_resident', (resident) => {
      console.log('Received new_resident:', resident);
      if (resident.society_id === authUser?.society_id) {
        addNotification(`🏠 New resident enrolled: ${resident.name}`);
        setResidents(prev => [resident, ...(prev || [])]);
        setData(prev => ({ ...prev, residentsCount: (prev.residentsCount || 0) + 1 }));
      }
    });

    socket.on('new_notice', (notice) => {
      console.log('Received new_notice (broadcast confirmation):', notice);
      if (notice.society_id === authUser?.society_id) {
        addNotification("📢 Society notice broadcasted");
        setData(prev => ({
          ...prev,
          notices: [notice, ...(prev.notices || [])]
        }));
      }
    });

    socket.on('visitor_status_update', (visitor) => {
      console.log('Received visitor_status_update:', visitor);
      setData(prev => ({
        ...prev,
        visitorAnalytics: { today: (prev.visitorAnalytics?.today || 0) } 
      }));
      // Optional: Update list if visible
    });

    return () => {
      console.log('Cleaning up socket listeners for AdminDashboard');
      socket.off('new_complaint');
      socket.off('new_resident');
      socket.off('new_notice');
      socket.off('visitor_status_update');
    };
  }, [authUser?.society_id]);

  const stats = [
    { label: 'Total Residents', value: data.residentsCount, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', type: 'residents' },
    { label: 'Collection (PAID)', value: `₹${(data.maintenanceRevenue).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', type: 'collection' },
    { label: 'Total Complaints', value: data.totalComplaints, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', type: 'complaints' },
    { label: 'Defaulters', value: data.paymentDefaulters, icon: CreditCard, color: 'text-rose-600', bg: 'bg-rose-50', type: 'defaulters' },
  ];

  const handleAddResident = async (e) => {
    e.preventDefault();
    try {
      const resp = await api.post('/auth/register', {
        ...newResident,
        password: 'Password123!',
        role: 'Resident',
        flat_number: newResident.flat,
        society_id: authSocietyId || authUser?.society_id
      });
      setShowResModal(false);
      const enrolledResident = resp.data.data.user;
      setResidents(prev => [enrolledResident, ...(prev || [])]);
      setData(prev => ({ ...prev, residentsCount: (prev.residentsCount || 0) + 1 }));
      setNewResident({ name: '', email: '', phone: '', wing: '', flat: '', isOwner: true });
    } catch (err) {
      alert(err.response?.data?.message || 'Error enrolling resident');
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
    } catch (err) {
      alert('Error updating complaint');
    }
  };

  const handlePostNotice = async (e) => {
    e.preventDefault();
    try {
      const resp = await api.post('/notices', newNotice);
      setShowNoticeModal(false);
      const postedNotice = resp.data.data;
      setData(prev => ({
        ...prev,
        notices: [postedNotice, ...(prev.notices || [])]
      }));
      setNewNotice({ title: '', content: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error deploying notice');
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-8 space-y-8 bg-[#f8fafc] min-h-screen text-slate-800"
    >
      {/* Real-time Notifications */}
      <div className="fixed top-6 right-6 z-[100] space-y-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="px-6 py-4 bg-white border border-indigo-100 rounded-2xl shadow-xl shadow-indigo-100/50 flex items-center gap-4 pointer-events-auto min-w-[300px]"
            >
              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 flex-shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-slate-900">{n.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium">Society Management Overview • {authUser?.society_name || 'Society'}</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowResModal(true)}
            className="px-6 h-12 bg-white border border-slate-200 text-slate-700 font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all rounded-xl shadow-sm"
          >
            <UserPlus className="w-5 h-5" /> Enroll Resident
          </Button>
          <Button 
            onClick={() => setShowNoticeModal(true)}
            className="px-6 h-12 bg-indigo-600 text-white font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-all rounded-xl shadow-md shadow-indigo-100"
          >
            <FileText className="w-5 h-5" /> Post Notice
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card 
              onClick={() => handleShowDetails(s.type)}
              className="p-6 cursor-pointer hover:shadow-lg transition-all border-slate-100 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors" />
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
        <Card className="lg:col-span-2 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Revenue Analysis</h3>
              <p className="text-slate-500 text-sm">Monthly collection performance</p>
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
                    backgroundColor: '#4f46e5',
                    borderRadius: 8,
                    barThickness: 32
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { grid: { borderDash: [5, 5] }, ticks: { font: { weight: '600' } } },
                    x: { grid: { display: false }, ticks: { font: { weight: '600' } } }
                  }
                }}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <TrendingUp className="w-12 h-12 mb-2 opacity-20" />
                <p className="font-semibold">No revenue data available yet</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Notices</h3>
          <NoticeBoard notices={data.notices} loading={loading} />
          <Button className="w-full mt-6 h-12 bg-slate-50 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-100 transition-all">
            View All
          </Button>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <h3 className="text-xl font-bold text-slate-900">Pending Complaints</h3>
          <Badge variant="warning" className="px-3 py-1 text-xs">Review Required</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc] text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4">Complaint / Resident</th>
                <th className="px-8 py-4">Priority</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.complaints?.slice(0, 5).map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-900">{c.title}</div>
                    <div className="text-xs text-slate-500 mt-1">
                       {c.User?.name || 'Unknown'} • {c.User?.flat_number || 'N/A'} • {c.User?.phone || 'No Phone'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      c.priority === 'HIGH' ? 'bg-rose-50 text-rose-600' : 
                      c.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'
                    }`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${c.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-xs font-semibold text-slate-700">{c.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Button 
                      onClick={() => setSelectedComplaint(c)}
                      className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                    >
                      Resolve
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Details Drill-down Modal */}
      <Modal 
        isOpen={!!detailsType} 
        onClose={() => setDetailsType(null)} 
        title={`${detailsType?.replace('_', ' ').toUpperCase()} DETAILS`}
        className="max-w-4xl bg-white p-2"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto p-4 custom-scrollbar">
          {detailsType === 'residents' && Array.isArray(detailsData) && (
            <div className="grid gap-4">
              {detailsData.map((r, i) => (
                <div key={i} className="p-5 border border-slate-100 rounded-2xl flex justify-between items-center hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                      {r.User?.name?.[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{r.User?.name}</div>
                      <div className="text-xs text-slate-500 font-medium">
                        {r.wing}-{r.flat_number} • {r.User?.phone} • {r.User?.email}
                      </div>
                    </div>
                  </div>
                  <Badge variant={r.is_owner ? 'success' : 'neutral'}>{r.is_owner ? 'Owner' : 'Tenant'}</Badge>
                </div>
              ))}
            </div>
          )}

          {detailsType === 'collection' || detailsType === 'defaulters' && Array.isArray(detailsData) && (
            <div className="grid gap-4">
              {detailsData.map((p, i) => (
                <div key={i} className="p-5 border border-slate-100 rounded-2xl flex justify-between items-center hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="font-bold text-slate-900">{p.Resident?.name}</div>
                    <div className="text-xs text-slate-500 font-medium">Flat {p.Resident?.flat_number} • {p.Resident?.phone || 'No Phone'} • Bill ID #{p.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 text-lg">₹{p.amount.toLocaleString()}</div>
                    <div className={`text-[10px] font-black tracking-widest uppercase ${p.status === 'PAID' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {p.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {detailsType === 'complaints' && Array.isArray(detailsData) && (
            <div className="grid gap-4">
              {detailsData.map((c, i) => (
                <div key={i} className="p-6 border border-slate-100 rounded-2xl space-y-3 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-slate-900 text-lg">{c.title}</div>
                      <div className="text-xs text-slate-500 font-bold mt-1">
                        RAISED BY: {c.User?.name} ({c.User?.flat_number}) • TEL: {c.User?.phone}
                      </div>
                    </div>
                    <Badge variant={c.status === 'RESOLVED' ? 'success' : 'warning'}>{c.status}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-50">{c.description}</p>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority: {c.priority}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">•</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {detailsData.length === 0 && (
            <div className="py-20 text-center text-slate-400 flex flex-col items-center">
              <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-semibold">No records found for this category</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Resolve Modal */}
      <Modal isOpen={!!selectedComplaint} onClose={() => setSelectedComplaint(null)} title="Complaint Resolution" className="max-w-2xl bg-white">
        {selectedComplaint && (
          <form onSubmit={handleUpdateComplaint} className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Complaint Details</h4>
              <p className="text-slate-900 font-semibold">{selectedComplaint.description}</p>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Update Status</label>
              <div className="grid grid-cols-3 gap-3">
                {['PENDING', 'IN_PROGRESS', 'RESOLVED'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setResStatus(s)}
                    className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                      resStatus === s ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Admin Response</label>
              <textarea 
                rows="4"
                placeholder="Briefly describe the action taken..."
                value={adminResponse}
                onChange={e => setAdminResponse(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 ring-indigo-500/20 outline-none transition-all"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-indigo-600 text-white h-14 font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
              Save Resolution
            </Button>
          </form>
        )}
      </Modal>

      {/* Enrollment Modal */}
      <Modal isOpen={showResModal} onClose={() => setShowResModal(false)} title="New Resident Entry" className="bg-white">
        <form onSubmit={handleAddResident} className="space-y-4">
          <Input label="Full Name" placeholder="John Doe" value={newResident.name} onChange={e => setNewResident({...newResident, name: e.target.value})} required />
          <Input label="Email Address" type="email" placeholder="john@example.com" value={newResident.email} onChange={e => setNewResident({...newResident, email: e.target.value})} required />
          <Input label="Phone Number" placeholder="+91 98765 43210" value={newResident.phone} onChange={e => setNewResident({...newResident, phone: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Wing/Block" placeholder="A" value={newResident.wing} onChange={e => setNewResident({...newResident, wing: e.target.value})} />
            <Input label="Flat Number" placeholder="101" value={newResident.flat} onChange={e => setNewResident({...newResident, flat: e.target.value})} />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <span className="text-sm font-bold text-slate-700">Ownership Status</span>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setNewResident({...newResident, isOwner: true})}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${newResident.isOwner ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
              >
                Owner
              </button>
              <button 
                type="button"
                onClick={() => setNewResident({...newResident, isOwner: false})}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${!newResident.isOwner ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
              >
                Tenant
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full bg-indigo-600 text-white h-14 font-bold rounded-2xl mt-4">Create Entry</Button>
        </form>
      </Modal>

      {/* Notice Modal */}
      <Modal isOpen={showNoticeModal} onClose={() => setShowNoticeModal(false)} title="Create New Announcement" className="bg-white">
        <form onSubmit={handlePostNotice} className="space-y-4">
          <Input label="Notice Title" placeholder="Maintenance Schedule" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} />
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Notice Body</label>
            <textarea 
              rows="5"
              placeholder="Provide details about the announcement..."
              value={newNotice.content}
              onChange={e => setNewNotice({...newNotice, content: e.target.value})}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-indigo-500/20"
            />
          </div>
          <Button type="submit" className="w-full bg-indigo-600 text-white h-14 font-bold rounded-2xl mt-4 shadow-lg shadow-indigo-100">Post Announcement</Button>
        </form>
      </Modal>
    </motion.div>
  );
};

export default AdminDashboard;
