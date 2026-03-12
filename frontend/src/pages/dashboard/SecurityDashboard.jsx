import React, { useState, useEffect } from 'react';
import api from '../../services/api';
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
  Building2
} from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState([]);
  const [statsData, setStatsData] = useState({ today: 0, pending: 0, active: 0 });
  const [showVisModal, setShowVisModal] = useState(false);
  const [newVisitor, setNewVisitor] = useState({ name: '', phone: '', resident_id: '', purpose: '' });
  const [residents, setResidents] = useState([]);

  const fetchData = async () => {
    try {
      const [visResp, dashResp, resResp] = await Promise.all([
        api.get('/visitors'),
        api.get('/dashboard'),
        api.get('/residents')
      ]);
      setVisitors(visResp.data);
      setResidents(resResp.data);
      setStatsData({
         today: dashResp.data.visitorAnalytics.today,
         pending: dashResp.data.complaintStats.find(c => c.status === 'PENDING')?.count || 0,
         active: dashResp.data.residentsCount
      });
    } catch (err) {
      console.error('Failed to fetch security data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const socket = io('http://localhost:5000');

    socket.on('new_visitor', (visitor) => {
       setVisitors(prev => [visitor, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  const handleRegisterVisitor = async (e) => {
    e.preventDefault();
    try {
      await api.post('/visitors', newVisitor);
      setShowVisModal(false);
      setNewVisitor({ name: '', phone: '', resident_id: '', purpose: '' });
      fetchData();
    } catch (err) {
      alert('Error registering visitor');
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
    { label: 'Active Entries', value: statsData.today, icon: UserCheck, color: 'emerald' },
    { label: 'Pending Audits', value: statsData.pending, icon: Clock, color: 'gold' },
    { label: 'Live Residents', value: statsData.active, icon: Users, color: 'primary' },
    { label: 'System Scans', value: '128', icon: Scan, color: 'gold' },
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-10 space-y-12 bg-slate-50 min-h-screen text-slate-800"
    >
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div>
           <div className="flex items-center gap-4 mb-4">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
              <p className="text-emerald-500 font-black uppercase tracking-[0.5em] text-[10px]">Sentinel Network Active</p>
           </div>
           <h1 className="text-6xl font-black text-primary-900 tracking-tighter uppercase italic">
             Tactical <span className="text-gold-500">Post</span>
           </h1>
           <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-[10px] mt-4">Royal Palms • Security Hub SR-01</p>
        </div>
        <div className="flex gap-6">
           <Button 
             onClick={() => setShowVisModal(true)}
             className="px-10 h-16 bg-elegant-gold text-primary-900 font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all rounded-2xl shadow-xl shadow-elegant-gold/20"
           >
              <UserPlus className="w-6 h-6" /> REGISTER ENTRY
           </Button>
           <Button className="px-10 h-16 bg-white border border-slate-200 shadow-sm text-slate-500 font-black flex items-center gap-3 hover:bg-slate-50 transition-all rounded-2xl group">
              <Scan className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" /> SECURE SCAN
           </Button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="luxury-card p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex justify-between items-start mb-8 relative z-10">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 border border-slate-200 shadow-sm
                   ${s.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-white text-elegant-gold'}`}>
                    <s.icon className="w-7 h-7" />
                 </div>
                 <div className="text-[10px] font-black tracking-widest px-3 py-1 rounded-full border border-white/5 text-slate-500 uppercase">
                    Protocol {i + 1}
                 </div>
              </div>
              <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2">{s.label}</p>
              <h3 className="text-4xl font-black text-primary-900 tracking-tighter">{s.value}</h3>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <motion.div variants={itemVariants} className="lg:col-span-2">
           <Card className="luxury-card overflow-hidden">
              <div className="p-12 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                 <h3 className="text-3xl font-black text-primary-900 tracking-tighter uppercase italic flex items-center gap-4">
                    <Activity className="w-8 h-8 text-emerald-500" />
                    Entry <span className="text-gold-500">Manifest</span>
                 </h3>
                 <Badge variant="success" className="px-5 py-2 rounded-xl text-[10px] font-black tracking-[0.2em] bg-emerald-500 text-slate-950">LIVE STREAM</Badge>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                       <tr>
                          <th className="px-12 py-8">Subject / Objective</th>
                          <th className="px-12 py-8">Credential</th>
                          <th className="px-12 py-8">Status</th>
                          <th className="px-12 py-8 text-right">Process</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       <AnimatePresence>
                          {visitors.map(v => (
                            <motion.tr 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              key={v.id} 
                              className="hover:bg-slate-50 transition-colors group"
                            >
                               <td className="px-12 py-10">
                                  <div className="font-black text-primary-900 text-lg group-hover:text-elegant-gold transition-colors uppercase italic">{v.name}</div>
                                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-2">
                                    PURPOSE: {v.purpose || 'UNSPECIFIED'}
                                  </div>
                               </td>
                               <td className="px-12 py-10 text-sm font-bold text-slate-400">{v.phone}</td>
                               <td className="px-12 py-10">
                                  <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg inline-block
                                    ${v.exit_time ? 'bg-slate-50 border border-slate-200 shadow-sm text-slate-600' : 'bg-emerald-500/10 text-emerald-600 animate-pulse'}`}>
                                     {v.exit_time ? 'ARCHIVED' : 'ON-SITE'}
                                  </div>
                               </td>
                               <td className="px-12 py-10 text-right">
                                  {v.exit_time ? (
                                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center justify-end gap-2">
                                       <CheckCircle2 className="w-3 h-3" /> {new Date(v.exit_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  ) : (
                                    <Button 
                                      onClick={() => handleCheckout(v.id)}
                                      className="px-6 h-10 bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-[0.1em] rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                                    >TERMINATE EXIT</Button>
                                  )}
                               </td>
                            </motion.tr>
                          ))}
                          {visitors.length === 0 && !loading && (
                             <tr>
                               <td colSpan="4" className="px-12 py-32 text-center">
                                  <div className="flex flex-col items-center gap-6">
                                     <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-slate-700">
                                        <Scan className="w-8 h-8" />
                                     </div>
                                     <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-xs">Awaiting Matrix Data • No Entries</p>
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
           <Card className="luxury-card p-12">
              <h3 className="text-2xl font-black text-primary-900 tracking-tighter mb-12 uppercase italic">Tactical <span className="text-gold-500">Actions</span></h3>
              <div className="space-y-6">
                 {[
                   { label: 'Panic Protocol', icon: AlertTriangle, color: 'red' },
                   { label: 'Vehicle Matrix', icon: Building2, color: 'blue' },
                   { label: 'Grid Status', icon: Scan, color: 'gold' },
                   { label: 'Registry Sync', icon: Users, color: 'gold' },
                 ].map((action, i) => (
                   <motion.button
                     whileHover={{ x: 8, backgroundColor: 'rgba(255,255,255,0.03)' }}
                     whileTap={{ scale: 0.98 }}
                     key={i}
                     className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-white/5 transition-all group"
                   >
                      <div className="flex items-center gap-6">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
                           ${action.color === 'red' ? 'bg-red-500/10 text-red-500' : 'bg-slate-900 text-gold-500'}`}>
                            <action.icon className="w-6 h-6" />
                         </div>
                         <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-primary-900 transition-colors">{action.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-gold-500 transition-colors" />
                   </motion.button>
                 ))}
              </div>
              <div className="mt-12 p-8 bg-gold-500/5 border border-gold-500/20 rounded-3xl">
                 <p className="text-[10px] font-black text-gold-500 uppercase tracking-[0.3em] mb-2 leading-loose">Automated backup active. All telemetry mirrored to Admin Command Center.</p>
              </div>
           </Card>
        </motion.div>
      </div>

      <Modal isOpen={showVisModal} onClose={() => setShowVisModal(false)} title="Strategic Entry Registration" className="bg-white">
         <form onSubmit={handleRegisterVisitor} className="space-y-8">
            <Input label="Subject Name" placeholder="Full legal name" value={newVisitor.name} onChange={e => setNewVisitor({...newVisitor, name: e.target.value})} className="input-luxury" />
            <Input label="Credential Primary" placeholder="Contact number" value={newVisitor.phone} onChange={e => setNewVisitor({...newVisitor, phone: e.target.value})} className="input-luxury" />
            
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Target Resident Node</label>
               <select 
                 value={newVisitor.resident_id}
                 onChange={e => setNewVisitor({...newVisitor, resident_id: e.target.value})}
                 className="input-luxury appearance-none cursor-pointer"
                 required
               >
                  <option value="" disabled className="bg-white">Select Destination</option>
                  {residents.map(r => (
                    <option key={r.id} value={r.id} className="bg-white text-primary-900 font-bold">
                       {r.User?.name} ({r.wing}-{r.flat_number})
                    </option>
                  ))}
               </select>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Objective of Entry</label>
               <textarea 
                 rows="4"
                 placeholder="State specific purpose..."
                 value={newVisitor.purpose}
                 onChange={e => setNewVisitor({...newVisitor, purpose: e.target.value})}
                 className="input-luxury min-h-[120px] resize-none"
               />
            </div>

            <Button type="submit" className="w-full btn-luxury uppercase h-20 text-lg shadow-2xl">Execute Entry</Button>
         </form>
      </Modal>
    </motion.div>
  );
};

export default SecurityDashboard;
