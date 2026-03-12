import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, MapPin, Search, ShieldCheck, Star, ArrowUpRight, Filter } from 'lucide-react';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/ui/Button';

export default function ResidentDirectory() {
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/users/residents')
      .then(r => setResidents(r.data || []))
      .catch(() => setResidents([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = residents.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    (r.flat_number && r.flat_number.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-8 h-8 rounded-lg bg-elegant-gold/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-elegant-gold" />
            </div>
            <span className="text-[10px] font-black text-elegant-gold uppercase tracking-[0.2em]">Private Society Registry</span>
          </motion.div>
          <h2 className="text-4xl font-black text-primary-900 tracking-tighter">Resident Directory</h2>
          <p className="text-slate-500 font-medium">Connect with your community and network with neighbors securely.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
              <input 
                className="w-full h-12 bg-white border border-slate-100 rounded-2xl pl-11 pr-4 text-xs font-bold text-primary-900 focus:ring-4 ring-elegant-gold/10 outline-none transition-all shadow-sm"
                placeholder="Search by name or flat..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>
           <button className="h-12 w-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary-900 shadow-sm transition-all">
              <Filter className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-[40px] border border-slate-100 p-8 hover:shadow-2xl hover:border-elegant-gold/20 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                 <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:text-elegant-gold hover:bg-elegant-gold/10 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
                    <ArrowUpRight className="w-5 h-5" />
                 </button>
              </div>

              <div className="flex flex-col items-center text-center">
                 <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-[32px] bg-slate-100 flex items-center justify-center text-primary-900 font-black text-3xl overflow-hidden ring-4 ring-white shadow-xl shadow-slate-200">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.name}`} alt="" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-primary-900 border-4 border-white flex items-center justify-center">
                       <ShieldCheck className="w-4 h-4 text-elegant-gold" />
                    </div>
                 </div>

                 <h5 className="text-xl font-black text-primary-900 tracking-tight leading-none mb-2">{r.name}</h5>
                 
                 <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-500 font-black text-[9px] uppercase tracking-widest mb-6">
                    <MapPin className="w-3 h-3 text-elegant-gold" />
                    {r.flat_number || `WING A - ${100 + r.id}`}
                 </div>

                 <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-slate-50">
                    <div className="text-left">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                       <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 underline underline-offset-4 decoration-emerald-500/30 font-black uppercase">Online</span>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Reputation</p>
                       <div className="flex items-center justify-end gap-1">
                          <Star className="w-3 h-3 text-elegant-gold fill-elegant-gold" />
                          <span className="text-[10px] font-black text-primary-900">4.9</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="mt-8 flex gap-3 w-full">
                    <Button variant="outline" className="flex-1 h-12 rounded-xl text-[9px] font-black tracking-widest uppercase border-slate-100 hover:border-elegant-gold text-slate-500">
                       PROFILE
                    </Button>
                    <Button className="flex-1 h-12 rounded-xl text-[9px] font-black tracking-widest uppercase bg-primary-900 text-white shadow-lg shadow-primary-900/10">
                       <div className="flex items-center gap-2">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>MESSAGE</span>
                       </div>
                    </Button>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!filtered.length && !loading && (
        <div className="py-40 flex flex-col items-center justify-center grayscale opacity-50">
          <Users className="w-20 h-20 text-slate-200 mb-6" />
          <h5 className="text-2xl font-black text-primary-900 tracking-tight mb-2">No Residents Found</h5>
          <p className="text-slate-400 font-medium max-w-xs text-center">We couldn't find any neighbors matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}
