import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Clock, ShieldCheck, ChevronRight, Phone, MessageSquare } from 'lucide-react';
import api from '../services/api';
import { getSocket } from '../services/socket';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/ui/Button';

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState([]);
  const [form, setForm] = useState({ visitor_name: '', phone: '', purpose: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get('/visitors')
      .then((r) => setVisitors(r.data || []))
      .catch(() => setVisitors([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    const socket = getSocket();
    
    const onUpdate = (updatedVisitor) => {
      setVisitors((prev) => 
        prev.map((v) => (v.id === updatedVisitor.id ? { ...v, ...updatedVisitor } : v))
      );
    };

    const onRequest = (newVisitor) => {
      setVisitors((prev) => {
        if (prev.find(v => v.id === newVisitor.id)) return prev;
        return [newVisitor, ...prev];
      });
    };

    socket.on('visitor_status_update', onUpdate);
    socket.on('visitor_request', onRequest);

    return () => {
      socket.off('visitor_status_update', onUpdate);
      socket.off('visitor_request', onRequest);
    };
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    api.post('/visitors', form)
      .then(() => {
        setForm({ visitor_name: '', phone: '', purpose: '' });
        setShowForm(false);
      });
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-8 h-8 rounded-lg bg-elegant-gold/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-elegant-gold" />
            </div>
            <span className="text-[10px] font-black text-elegant-gold uppercase tracking-[0.2em]">Security Protocol Active</span>
          </motion.div>
          <h2 className="text-4xl font-black text-primary-900 tracking-tighter">Visitor Management</h2>
          <p className="text-slate-500 font-medium">Pre-authorize guests and track entry logs in real-time.</p>
        </div>
        
        <Button 
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'secondary' : 'primary'}
          className="h-14 px-8 rounded-2xl shadow-xl hover:scale-105 transition-all w-full md:w-auto"
        >
          {showForm ? 'Cancel Request' : (
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              <span>PRE-AUTHORIZE GUEST</span>
            </div>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <DashboardCard title="Guest Authorization" subtitle="Details for secure entry">
              <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary-900 uppercase tracking-widest pl-1">Visitor Full Name</label>
                  <input 
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 font-bold text-primary-900 focus:ring-2 ring-elegant-gold/20 outline-none transition-all"
                    value={form.visitor_name}
                    onChange={e => setForm(p => ({...p, visitor_name: e.target.value}))}
                    placeholder="Enter full name"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary-900 uppercase tracking-widest pl-1">Phone Number</label>
                  <input 
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 font-bold text-primary-900 focus:ring-2 ring-elegant-gold/20 outline-none transition-all"
                    value={form.phone}
                    onChange={e => setForm(p => ({...p, phone: e.target.value}))}
                    placeholder="+91 00000 00000"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-primary-900 uppercase tracking-widest pl-1">Purpose of Visit</label>
                  <div className="flex gap-4">
                    <input 
                      className="flex-1 h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 font-bold text-primary-900 focus:ring-2 ring-elegant-gold/20 outline-none transition-all"
                      value={form.purpose}
                      onChange={e => setForm(p => ({...p, purpose: e.target.value}))}
                      placeholder="e.g. Regular Guest"
                    />
                    <Button type="submit" className="h-14 px-8 rounded-2xl">GENERATE PASS</Button>
                  </div>
                </div>
              </form>
            </DashboardCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'Total Visits', value: visitors.length, icon: Users, color: 'primary' },
          { label: 'Inside Society', value: visitors.filter(v => v.status === 'IN').length, icon: ShieldCheck, color: 'emerald' },
          { label: 'Pending Entry', value: visitors.filter(v => v.status === 'PENDING').length, icon: Clock, color: 'amber' },
          { label: 'Frequent Guests', value: '12', icon: UserPlus, color: 'gold' },
        ].map((stat, i) => (
          <DashboardCard key={i} className="hover:scale-[1.02] transition-transform cursor-default">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-${stat.color === 'gold' ? 'elegant-gold' : stat.color}-500/10 text-${stat.color === 'gold' ? 'elegant-gold' : stat.color}-500`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-black text-primary-900">{stat.value}</h3>
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>

      <DashboardCard title="Real-time Tracking" subtitle="Live visitor logs and arrival history">
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Guest Information</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Visit Details</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">System Status</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 text-right">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {visitors.map((v) => (
                  <motion.tr 
                    key={v.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-5 px-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary-900 font-black text-xs group-hover:bg-elegant-gold/10 group-hover:text-elegant-gold transition-colors">
                          {v.visitor_name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-primary-900 font-bold group-hover:text-elegant-gold transition-colors">{v.visitor_name}</span>
                          <span className="text-[10px] text-slate-400 font-black flex items-center gap-1 uppercase tracking-widest">
                            <Phone className="w-2.5 h-2.5" /> {v.phone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex flex-col">
                        <span className="text-primary-900 font-black text-[11px] uppercase tracking-tighter">{v.purpose || 'Personal Visit'}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 tracking-widest">
                          <MessageSquare className="w-2.5 h-2.5" /> ID: #{v.id}0{v.id}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border
                        ${v.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' : ''}
                        ${v.status === 'IN' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : ''}
                        ${v.status === 'OUT' ? 'bg-slate-50 text-slate-500 border-slate-200' : ''}
                      `}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse
                          ${v.status === 'PENDING' ? 'bg-amber-600' : ''}
                          ${v.status === 'IN' ? 'bg-emerald-600' : ''}
                          ${v.status === 'OUT' ? 'bg-slate-500' : ''}
                        `} />
                        {v.status}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-primary-900 font-bold text-xs">
                          {v.entry_time ? new Date(v.entry_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Waiting'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          {v.exit_time ? `Out: ${new Date(v.exit_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'Check-in pending'}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {!visitors.length && !loading && (
            <div className="py-20 flex flex-col items-center justify-center grayscale opacity-50">
              <Users className="w-16 h-16 text-slate-200 mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No visitor records found today</p>
            </div>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}

