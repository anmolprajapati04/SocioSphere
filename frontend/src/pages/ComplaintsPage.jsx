import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, AlertCircle, Clock, CheckCircle2, Send, MessageCircle, ShieldAlert, Zap } from 'lucide-react';
import api from '../services/api';
import { getSocket } from '../services/socket';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/ui/Button';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', priority: 'LOW' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get('/complaints')
      .then((r) => setComplaints(r.data || []))
      .catch(() => setComplaints([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    const socket = getSocket();
    
    const onUpdate = (updatedComplaint) => {
      setComplaints((prev) => 
        prev.map((c) => (c.id === updatedComplaint.id ? { ...c, ...updatedComplaint } : c))
      );
    };

    socket.on('complaint_update', onUpdate);
    return () => socket.off('complaint_update', onUpdate);
  }, []);

  function submit(e) {
    e.preventDefault();
    if (!form.title || !form.description) {
      setError('Subject and details are required.');
      return;
    }
    setError('');
    api
      .post('/complaints', form)
      .then(() => {
        setForm({ title: '', description: '', priority: 'LOW' });
        load();
      })
      .catch(() => setError('Service desk is temporarily busy. Please try again.'));
  }

  const getPriorityColor = (p) => {
    switch(p) {
      case 'HIGH': return 'rose';
      case 'MEDIUM': return 'amber';
      default: return 'slate';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            </div>
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Priority Fast-Track Enabled</span>
          </motion.div>
          <h2 className="text-4xl font-black text-primary-900 tracking-tighter">Support Desk</h2>
          <p className="text-slate-500 font-medium">Raise tickets and track resolution progress in real-time.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Avg. Resolution Time</span>
              <span className="text-lg font-black text-primary-900 tracking-tighter">4.2 Hours</span>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <DashboardCard title="New Ticket" subtitle="Explain the issue details">
            <form onSubmit={submit} className="space-y-6 mt-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary-900 uppercase tracking-widest pl-1">Issue Subject</label>
                <input
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 font-bold text-primary-900 focus:ring-2 ring-elegant-gold/20 outline-none transition-all"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Water leak in kitchen"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary-900 uppercase tracking-widest pl-1">Urgency Level</label>
                <div className="flex gap-2">
                  {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, priority: p }))}
                      className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border
                        ${form.priority === p 
                          ? `bg-${getPriorityColor(p)}-500 text-white border-${getPriorityColor(p)}-500 shadow-lg shadow-${getPriorityColor(p)}-500/20 scale-105` 
                          : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}
                      `}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary-900 uppercase tracking-widest pl-1">Detailed Description</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 font-bold text-primary-900 focus:ring-2 ring-elegant-gold/20 outline-none transition-all"
                  style={{ minHeight: 140, resize: 'none' }}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe the issue in detail..."
                />
                {error && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{error}</p>}
              </div>

              <Button className="w-full h-14 rounded-2xl shadow-xl hover:scale-105 transition-all text-[11px] font-black tracking-widest uppercase">
                 SUBMIT TICKET
              </Button>
            </form>
          </DashboardCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-[11px] font-black text-primary-900 uppercase tracking-[0.3em] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-elegant-gold" />
              Active Tickets
            </h4>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{complaints.length} Total</span>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {complaints.map((c, i) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:border-elegant-gold/20 transition-all group"
                >
                  <div className="flex justify-between items-start gap-6 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                         <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border
                           ${c.priority === 'HIGH' ? 'bg-rose-50 text-rose-600 border-rose-100' : ''}
                           ${c.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-100' : ''}
                           ${c.priority === 'LOW' ? 'bg-slate-50 text-slate-500 border-slate-100' : ''}
                         `}>
                           {c.priority} PRIORITY
                         </span>
                         <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ticket #ID-{c.id}0{c.id}</span>
                      </div>
                      <h5 className="text-xl font-black text-primary-900 tracking-tight mb-2 group-hover:text-elegant-gold transition-colors">{c.title}</h5>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">{c.description}</p>
                    </div>
                    
                    <div className="text-right flex flex-col items-end gap-2">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border
                         ${c.status === 'PENDING' ? 'bg-slate-50 text-slate-500 border-slate-200' : ''}
                         ${c.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border-blue-100' : ''}
                         ${c.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : ''}
                       `}>
                         <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'IN_PROGRESS' ? 'animate-ping' : ''}
                           ${c.status === 'PENDING' ? 'bg-slate-400' : ''}
                           ${c.status === 'IN_PROGRESS' ? 'bg-blue-600' : ''}
                           ${c.status === 'RESOLVED' ? 'bg-emerald-600' : ''}
                         `} />
                         {c.status.replace('_', ' ')}
                       </span>
                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 py-6 border-y border-slate-50 mb-6">
                     {[
                       { step: 1, label: 'Raised', completed: true, icon: Send },
                       { step: 2, label: 'Assigned', completed: c.status !== 'PENDING', icon: Clock },
                       { step: 3, label: 'Resolving', completed: c.status === 'RESOLVED' || c.status === 'IN_PROGRESS', icon: Zap },
                       { step: 4, label: 'Fixed', completed: c.status === 'RESOLVED', icon: CheckCircle2 },
                     ].map((item, idx) => (
                       <div key={idx} className={`flex items-center gap-2 ${item.completed ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${item.completed ? 'bg-primary-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                             <item.icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-primary-900">{item.label}</span>
                          {idx < 3 && <div className="w-4 h-px bg-slate-200" />}
                       </div>
                     ))}
                  </div>

                  {c.admin_response ? (
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex gap-4">
                       <div className="w-10 h-10 rounded-xl bg-primary-900 flex items-center justify-center text-white flex-shrink-0">
                          <MessageCircle className="w-5 h-5 text-elegant-gold" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-primary-900 uppercase tracking-widest mb-1">Estate Management Response</p>
                          <p className="text-sm text-slate-600 italic font-medium leading-relaxed">"{c.admin_response}"</p>
                       </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">
                       <span>Waiting for management response...</span>
                       <button className="text-primary-900 hover:text-elegant-gold transition-colors">GET STATUS UPDATE</button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {!complaints.length && !loading && (
              <div className="py-20 flex flex-col items-center justify-center grayscale opacity-50">
                <MessageSquare className="w-16 h-16 text-slate-200 mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No active support tickets</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

