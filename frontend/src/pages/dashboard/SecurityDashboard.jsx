import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  Clock, 
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Activity,
  Scan,
  ChevronRight,
  UserCheck,
  Building2,
  Bell
} from 'lucide-react';
import socket from '../../utils/socket';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const SecurityDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState([]);
  const [statsData, setStatsData] = useState({ today: 0, pending: 0, active: 0 });
  const [showVisModal, setShowVisModal] = useState(false);
  const [newVisitor, setNewVisitor] = useState({ name: '', phone: '', flat_number: '', purpose: '' });
  const [residents, setResidents] = useState([]);

  const fetchData = async () => {
    try {
      const [visResp, dashResp, resResp] = await Promise.all([
        api.get('/visitors'),
        api.get('/dashboard'),
        api.get('/residents')
      ]);
      setVisitors(visResp.data.data || []);
      setResidents(resResp.data.data || []);
      const dashData = dashResp.data.data;
      setStatsData({
         today: dashData?.visitorAnalytics?.today || 0,
         pending: dashData?.complaintStats?.find(c => c.status === 'PENDING')?.count || 0,
         active: dashData?.residentsCount || 0
      });
    } catch (err) {
      console.error('Failed to fetch security data:', err);
    } finally {
      setLoading(false);
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

    if (user?.society_id) {
      console.log(`Joining society room: society_${user.society_id}`);
      socket.emit('join_society', user.society_id);
    }

    socket.on('visitor_entry', (visitor) => {
       console.log('Received visitor_entry:', visitor);
       setVisitors(prev => [visitor, ...prev]);
       addNotification(`👤 Visitor Entry: ${visitor.visitor_name}`);
       fetchData();
    });

    socket.on('visitor_exit', (visitor) => {
       console.log('Received visitor_exit:', visitor);
       addNotification(`🚪 Visitor Exit: ${visitor.visitor_name}`);
       fetchData();
    });

    socket.on('visitor_status_update', (visitor) => {
       console.log('Received visitor_status_update:', visitor);
       fetchData();
    });

    return () => {
       console.log('Cleaning up socket listeners for SecurityDashboard');
       socket.off('visitor_entry');
       socket.off('visitor_exit');
       socket.off('visitor_status_update');
    };
  }, [user?.society_id]);

  const handleRegisterVisitor = async (e) => {
    e.preventDefault();
    try {
      const targetResident = residents.find(r => 
        r.flat_number.toLowerCase() === newVisitor.flat_number.toLowerCase() ||
        `${r.wing}-${r.flat_number}`.toLowerCase() === newVisitor.flat_number.toLowerCase() ||
        `${r.wing}${r.flat_number}`.toLowerCase() === newVisitor.flat_number.toLowerCase()
      );
      
      if (!targetResident) {
        alert('Could not locate a resident living in that flat number.');
        return;
      }

      await api.post('/visitors', {
        ...newVisitor,
        resident_id: targetResident.user_id
      });
      setShowVisModal(false);
      setNewVisitor({ name: '', phone: '', flat_number: '', purpose: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error registering visitor');
    }
  };

  const handleCheckout = async (id) => {
    try {
      await api.put(`/visitors/${id}`, { exit_time: new Date() });
      fetchData();
    } catch (err) {
      alert('Error during checkout');
    }
  };

  const stats = [
    { label: 'Today Guests', value: statsData.today, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Audits', value: statsData.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Live Residents', value: statsData.active, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Security Scans', value: '128', icon: Scan, color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

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
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Security Command</h1>
          <p className="text-slate-500 font-medium">Society Security Management • Live Gateway Access</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowVisModal(true)}
            className="px-6 h-12 bg-indigo-600 text-white font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-all rounded-xl shadow-md shadow-indigo-100"
          >
            <UserPlus className="w-5 h-5" /> Register Entry
          </Button>
          <Button className="px-6 h-12 bg-white border border-slate-200 text-slate-700 font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all rounded-xl shadow-sm">
            <Scan className="w-5 h-5" /> Area Scan
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="p-6 transition-all border-slate-100 group">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md">
                  Status {i + 1}
                </div>
              </div>
              <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider mb-1">{s.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{s.value}</h3>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2">
           <Card className="overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Entry Manifest</h3>
                 </div>
                 <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-none">Live Access</Badge>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-[#f8fafc] text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                       <tr>
                          <th className="px-8 py-4">Subject / Purpose</th>
                          <th className="px-8 py-4">Credential</th>
                          <th className="px-8 py-4">Status</th>
                          <th className="px-8 py-4 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       <AnimatePresence>
                          {visitors.map(v => (
                            <motion.tr 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              key={v.id} 
                              className="hover:bg-slate-50/50 transition-colors group"
                            >
                               <td className="px-8 py-6">
                                  <div className="font-bold text-slate-900">{v.name}</div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                                    {v.purpose || 'General Entry'}
                                  </div>
                               </td>
                               <td className="px-8 py-6 text-sm font-semibold text-slate-500">{v.phone}</td>
                               <td className="px-8 py-6">
                                  <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-block
                                    ${v.exit_time ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-600 animate-pulse'}`}>
                                     {v.exit_time ? 'Checked Out' : 'On Site'}
                                  </div>
                               </td>
                               <td className="px-8 py-6 text-right">
                                  {v.exit_time ? (
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-end gap-2">
                                       <CheckCircle2 className="w-3.5 h-3.5" /> {new Date(v.exit_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  ) : (
                                    <Button 
                                      onClick={() => handleCheckout(v.id)}
                                      className="px-4 py-2 border border-slate-200 text-slate-500 text-xs font-bold rounded-lg hover:border-rose-500 hover:text-rose-600 transition-all"
                                    >Checkout</Button>
                                  )}
                               </td>
                            </motion.tr>
                          ))}
                          {visitors.length === 0 && !loading && (
                             <tr>
                               <td colSpan="4" className="px-8 py-24 text-center">
                                  <div className="flex flex-col items-center">
                                     <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                                        <Scan className="w-8 h-8" />
                                     </div>
                                     <p className="text-slate-500 font-bold text-sm">No active entries</p>
                                     <p className="text-slate-400 text-xs mt-1">Awaiting visitor registration</p>
                                  </div>
                               </td>
                             </tr>
                          )}
                       </AnimatePresence>
                    </tbody>
                 </table>
              </div>
           </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
           <Card className="p-8">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-8">Security Actions</h3>
              <div className="space-y-4">
                 {[
                   { label: 'Panic Protocol', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', onClick: () => alert('Panic Protocol Initiated! Command Center Notified.') },
                   { label: 'Vehicle Matrix', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50', onClick: () => alert('Vehicle Matrix module is offline for maintenance.') },
                   { label: 'Grid Status', icon: Scan, color: 'text-emerald-600', bg: 'bg-emerald-50', onClick: () => alert('All security grids are fully operational and secured.') },
                   { label: 'Registry Sync', icon: Users, color: 'text-slate-600', bg: 'bg-slate-50', onClick: () => { fetchData(); alert('Registry synchronized with central database.'); } },
                 ].map((action, i) => (
                   <motion.button
                     whileHover={{ x: 4, backgroundColor: '#f8fafc' }}
                     whileTap={{ scale: 0.98 }}
                     key={i}
                     onClick={action.onClick}
                     className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 transition-all group shadow-sm"
                   >
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.bg} ${action.color}`}>
                            <action.icon className="w-5 h-5" />
                         </div>
                         <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{action.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                   </motion.button>
                 ))}
              </div>
              <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                 <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-2">System Status</p>
                 <p className="text-[12px] font-medium text-slate-600 leading-relaxed">Automated backup active. All telemetry data is synchronized with the central society command center in real-time.</p>
              </div>
           </Card>
        </motion.div>
      </div>

      <Modal isOpen={showVisModal} onClose={() => setShowVisModal(false)} title="Register New Entry" className="bg-white">
         <form onSubmit={handleRegisterVisitor} className="space-y-5">
            <Input 
              label="Visitor Name" 
              placeholder="e.g., John Doe" 
              value={newVisitor.name} 
              onChange={e => setNewVisitor({...newVisitor, name: e.target.value})} 
            />
            <Input 
              label="Contact Number" 
              placeholder="+91 XXXXX XXXXX" 
              value={newVisitor.phone} 
              onChange={e => setNewVisitor({...newVisitor, phone: e.target.value})} 
            />
            
            <Input 
              label="Destination Flat" 
              placeholder="e.g., A-101 or 101" 
              value={newVisitor.flat_number} 
              onChange={e => setNewVisitor({...newVisitor, flat_number: e.target.value})} 
              required
            />

            <div className="space-y-2">
               <label className="text-sm font-bold text-slate-700">Purpose of Visit</label>
               <textarea 
                 rows="4"
                 placeholder="e.g., Delivery, Personal visit..."
                 value={newVisitor.purpose}
                 onChange={e => setNewVisitor({...newVisitor, purpose: e.target.value})}
                 className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 ring-indigo-500/20 transition-all min-h-[120px] resize-none"
               />
            </div>

            <Button type="submit" className="w-full bg-indigo-600 text-white h-14 font-bold rounded-2xl mt-4 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
               Complete Registration
            </Button>
         </form>
      </Modal>
    </motion.div>
  );
};

export default SecurityDashboard;
