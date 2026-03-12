import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Bell, ShieldCheck, Tag, Send, Search, TrendingUp, Info } from 'lucide-react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/ui/Button';

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', category: 'GENERAL' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  function load() {
    setLoading(true);
    api
      .get('/notices')
      .then((r) => setNotices(r.data || []))
      .catch(() => setNotices([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function submit(e) {
    e.preventDefault();
    if (!form.title || !form.content) {
      setError('Subject and content are required.');
      return;
    }
    setError('');
    api
      .post('/notices', form)
      .then(() => {
        setForm({ title: '', content: '', category: 'GENERAL' });
        load();
      })
      .catch(() => setError('Bulletin broad is currently locked. Try again later.'));
  }

  const filteredNotices = filter === 'ALL' ? notices : notices.filter(n => n.category === filter);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-indigo-500" />
            </div>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Official Broadcast Pipeline</span>
          </motion.div>
          <h2 className="text-4xl font-black text-primary-900 tracking-tighter">Society Bulletins</h2>
          <p className="text-slate-500 font-medium">Verified announcements and critical updates for residents.</p>
        </div>
        
        <div className="flex bg-white p-2 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
           {['ALL', 'GENERAL', 'EVENT', 'URGENT'].map(t => (
             <button 
               key={t} 
               onClick={() => setFilter(t)}
               className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl
                 ${filter === t ? 'bg-primary-900 text-white shadow-lg' : 'text-slate-400 hover:text-primary-900'}
               `}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
          <DashboardCard title="New Broadcast" subtitle="Reach every resident immediately" className="border-none shadow-2xl shadow-indigo-500/5 ring-1 ring-slate-100">
            <form onSubmit={submit} className="space-y-6 mt-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary-900 uppercase tracking-widest pl-1">Headline</label>
                <input
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 font-bold text-primary-900 focus:ring-2 ring-indigo-500/20 outline-none transition-all placeholder:text-slate-300"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Annual General Meeting 2026"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary-900 uppercase tracking-widest pl-1">Importance Level</label>
                <div className="flex gap-2">
                  {['GENERAL', 'EVENT', 'URGENT'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, category: cat }))}
                      className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border
                        ${form.category === cat 
                          ? 'bg-primary-900 text-white border-primary-900 shadow-md' 
                          : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}
                      `}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary-900 uppercase tracking-widest pl-1">Notice Content</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 font-bold text-primary-900 focus:ring-2 ring-indigo-500/20 outline-none transition-all min-h-[160px] resize-none placeholder:text-slate-300"
                  value={form.content}
                  onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Draft your official announcement here..."
                />
                {error && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest pl-1">{error}</p>}
              </div>

              <Button className="w-full h-14 rounded-2xl shadow-xl hover:scale-105 transition-all text-[11px] font-black tracking-widest uppercase bg-primary-900 text-white">
                 <div className="flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    <span>PUBLISH OFFICIAL NOTICE</span>
                 </div>
              </Button>

              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100/50 flex gap-3">
                 <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                 <p className="text-[9px] text-indigo-700/70 leading-relaxed font-medium">All residents will receive a real-time push notification once published.</p>
              </div>
            </form>
          </DashboardCard>
        </div>

        <div className="lg:col-span-8 space-y-6">
           <AnimatePresence mode="popLayout text-primary-900">
             {filteredNotices.map((n, i) => (
               <motion.div
                 key={n.id}
                 layout
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="bg-white rounded-[40px] border border-slate-100 p-10 hover:shadow-2xl hover:border-elegant-gold/20 transition-all group relative overflow-hidden"
               >
                 <div className="absolute top-0 left-0 w-2 h-full bg-primary-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                 
                 <div className="flex justify-between items-start mb-8">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary-900 group-hover:bg-elegant-gold/10 group-hover:text-elegant-gold transition-colors">
                        <Megaphone className="w-6 h-6" />
                      </div>
                      <div>
                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border mb-1 inline-block
                          ${n.category === 'URGENT' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}
                        `}>
                          {n.category || 'General'}
                        </span>
                        <h5 className="text-2xl font-black text-primary-900 tracking-tight leading-none">{n.title}</h5>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Published On</p>
                      <p className="text-sm font-bold text-primary-900">{new Date(n.createdAt || Date.now()).toLocaleDateString('default', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                   </div>
                 </div>

                 <div className="prose prose-slate max-w-none">
                    <p className="text-base text-slate-500 leading-relaxed font-medium">{n.content}</p>
                 </div>

                 <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                             <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          </div>
                          <span className="text-[10px] font-black text-primary-900 uppercase tracking-widest">Verified Official</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-indigo-400" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">98% Residents Seen</span>
                       </div>
                    </div>
                    <div className="flex gap-3">
                       <button className="h-10 px-6 rounded-xl text-[9px] font-black tracking-widest uppercase border border-slate-100 text-slate-400 hover:border-primary-900 hover:text-primary-900 transition-all">VIEW ATTACHMENTS</button>
                       <button className="h-10 px-6 rounded-xl text-[9px] font-black tracking-widest uppercase bg-slate-50 text-primary-900 hover:bg-elegant-gold hover:text-white transition-all">DOWNLOAD PDF</button>
                    </div>
                 </div>
               </motion.div>
             ))}
           </AnimatePresence>

           {!filteredNotices.length && !loading && (
             <div className="py-32 text-center bg-slate-50/50 rounded-[60px] border-2 border-dashed border-slate-100">
               <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
                  <Megaphone className="w-10 h-10 text-slate-200" />
               </div>
               <h5 className="text-xl font-black text-primary-900 tracking-tight mb-2">The Board is Quiet</h5>
               <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm">No official broadcasts have been published recently. Important updates will appear here.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

