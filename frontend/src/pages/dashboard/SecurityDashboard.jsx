import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  Clock, 
  LogOut, 
  LogIn,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const SecurityDashboard = () => {
  const [visitors, setVisitors] = useState([
    { id: 1, name: 'Rahul Sharma', phone: '+91 98765 43210', resident: 'Sarah Jenkins (A-1204)', type: 'Guest', status: 'IN', time: '10:30 AM' },
    { id: 2, name: 'Delivery - Amazon', phone: 'Verified', resident: 'Multiple Units', type: 'Delivery', status: 'OUT', time: '11:15 AM' },
    { id: 3, name: 'Priya Verma', phone: '+91 98765 12345', resident: 'Vikram Malhotra (B-402)', type: 'Guest', status: 'PENDING', time: '11:45 AM' },
  ]);

  const stats = [
    { label: 'Active Entries', value: '14', icon: LogIn, color: 'emerald' },
    { label: 'Pending Approvals', value: '3', icon: Clock, color: 'gold' },
    { label: 'Total Visitors Today', value: '42', icon: Users, color: 'primary' },
    { label: 'Blacklisted', value: '0', icon: AlertTriangle, color: 'danger' },
  ];

  return (
    <div className="p-10 space-y-12 bg-slate-50 min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
           <h1 className="text-4xl font-black text-primary-900 tracking-tighter">Gate Control Console</h1>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Royal Palms Entrance 1 Security Hub</p>
        </div>
        <div className="flex gap-4">
           <Button className="bg-primary-900 text-white border-none px-8 h-16 rounded-2xl font-black flex items-center gap-3 shadow-2xl">
              <UserPlus className="w-6 h-6" /> REGISTER VISITOR
           </Button>
           <Button className="bg-elegant-gold text-primary-900 border-none px-8 h-16 rounded-2xl font-black flex items-center gap-3">
              <ShieldCheck className="w-6 h-6" /> SCAN QR PASS
           </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <Card key={i} className="luxury-card p-8 group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 
              ${s.color === 'gold' ? 'bg-gold-500/10 text-gold-600' : ''}
              ${s.color === 'primary' ? 'bg-primary-900/10 text-primary-900' : ''}
              ${s.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : ''}
              ${s.color === 'danger' ? 'bg-red-500/10 text-red-500' : ''}
            `}>
              <s.icon className="w-7 h-7" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">{s.label}</p>
            <h3 className="text-3xl font-black text-primary-900 tracking-tighter">{s.value}</h3>
          </Card>
        ))}
      </div>

      <Card className="luxury-card overflow-hidden">
         <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-8">
               <h3 className="text-2xl font-black text-primary-900 tracking-tighter">Live Visitor Log</h3>
               <div className="relative group flex items-center gap-4">
                  <div className="relative w-64">
                     <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-primary-900 transition-colors" />
                     <input type="text" placeholder="Search visits..." className="h-12 pl-12 pr-6 bg-slate-50 border-none rounded-xl text-sm font-bold text-primary-900 w-full focus:ring-2 ring-primary-900/10 transition-all" />
                  </div>
                  <button className="w-12 h-12 bg-white shadow-lg rounded-xl flex items-center justify-center text-slate-400 hover:text-primary-900 transition-all border border-slate-100">
                     <Filter className="w-5 h-5" />
                  </button>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Feed Active
               </span>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                     <th className="px-10 py-5">Visitor Name</th>
                     <th className="px-10 py-5">Resident / Unit</th>
                     <th className="px-10 py-5">Purpose</th>
                     <th className="px-10 py-5">Status</th>
                     <th className="px-10 py-5">Activity Time</th>
                     <th className="px-10 py-5">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {visitors.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-10 py-6">
                          <div className="font-bold text-primary-900">{v.name}</div>
                          <div className="text-[10px] uppercase font-black text-slate-300 tracking-widest mt-1">{v.phone}</div>
                       </td>
                       <td className="px-10 py-6 font-bold text-slate-500 text-sm whitespace-nowrap">{v.resident}</td>
                       <td className="px-10 py-6 font-bold text-slate-400 text-xs tracking-widest uppercase">{v.type}</td>
                       <td className="px-10 py-6">
                          <Badge variant={v.status === 'IN' ? 'success' : v.status === 'PENDING' ? 'warning' : 'outline'}>
                             {v.status}
                          </Badge>
                       </td>
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
                             <Clock className="w-3.5 h-3.5 text-slate-300" /> {v.time}
                          </div>
                       </td>
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-3">
                             {v.status === 'PENDING' ? (
                               <>
                                 <button className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                                    <CheckCircle2 className="w-5 h-5" />
                                 </button>
                                 <button className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                                    <XCircle className="w-5 h-5" />
                                 </button>
                               </>
                             ) : (
                                <button className="text-slate-300 hover:text-primary-900 transition-colors">
                                   <MoreVertical className="w-5 h-5" />
                                </button>
                             )}
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
