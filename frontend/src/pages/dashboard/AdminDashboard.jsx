import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  ArrowDownRight
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

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Residents', value: '428', icon: Users, trend: '+5.2%', up: true },
    { label: 'Collection Rate', value: '94%', icon: TrendingUp, trend: '+2.1%', up: true },
    { label: 'Open Complaints', value: '18', icon: AlertCircle, trend: '-12%', up: false },
    { label: 'Monthly Revenue', value: '₹12.5L', icon: CreditCard, trend: '+8.4%', up: true },
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
    <div className="p-10 space-y-12 bg-slate-50 min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
           <h1 className="text-4xl font-black text-primary-900 tracking-tighter">Secretary Console</h1>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Royal Palms Management Panel</p>
        </div>
        <div className="flex gap-4">
           <Button className="bg-primary-900 text-white border-none px-8 font-black flex items-center gap-2">
              <UserPlus className="w-5 h-5" /> ADD RESIDENT
           </Button>
           <Button variant="outline" className="border-slate-200 text-primary-900 font-black flex items-center gap-2">
              <FileText className="w-5 h-5" /> EXPORT REPORTS
           </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <Card key={i} className="luxury-card p-8 bg-white border-none">
            <div className="flex justify-between items-start mb-6">
               <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-primary-900">
                  <s.icon className="w-6 h-6" />
               </div>
               <div className={`flex items-center gap-1 text-[10px] font-black tracking-tighter px-2 py-1 rounded-full 
                  ${s.up ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {s.trend}
               </div>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">{s.label}</p>
            <h3 className="text-3xl font-black text-primary-900 tracking-tighter">{s.value}</h3>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
         <Card className="luxury-card p-10 lg:col-span-2">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="text-2xl font-black text-primary-900 tracking-tighter">Financial Analytics</h3>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Maintenance vs Collection</p>
               </div>
               <div className="flex gap-2">
                  {['Weekly', 'Monthly', 'Yearly'].map(t => (
                    <button key={t} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                      t === 'Monthly' ? 'bg-primary-900 text-white' : 'text-slate-400 hover:text-primary-900'
                    }`}>{t}</button>
                  ))}
               </div>
            </div>
            <div className="h-[350px] flex items-center justify-center italic text-slate-300 font-bold">
               [ Interactive Chart Container ]
            </div>
         </Card>

         <Card className="luxury-card p-10 flex flex-col items-center justify-center">
            <h3 className="text-2xl font-black text-primary-900 tracking-tighter mb-10 w-full">Revenue Split</h3>
            <div className="w-64 h-64">
               <Doughnut data={collectionData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
            </div>
            <div className="grid grid-cols-2 gap-6 w-full mt-10">
               {['Maintenance', 'Amenities', 'Fines', 'Others'].map((item, i) => (
                  <div key={item} className="flex flex-col gap-1">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${['bg-primary-900', 'bg-elegant-gold', 'bg-emerald-500', 'bg-slate-300'][i]}`} />
                        {item}
                     </span>
                     <span className="text-lg font-black text-primary-900 tracking-tight">
                        {['65%', '15%', '10%', '10%'][i]}
                     </span>
                  </div>
               ))}
            </div>
         </Card>
      </div>

      <Card className="luxury-card overflow-hidden">
         <div className="p-10 flex justify-between items-center">
            <div className="flex items-center gap-8">
               <h3 className="text-2xl font-black text-primary-900 tracking-tighter">Recent Societies Requests</h3>
               <div className="relative group">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-primary-900 transition-colors" />
                  <input type="text" placeholder="Search residents..." className="h-12 pl-12 pr-6 bg-slate-50 border-none rounded-xl text-sm font-bold text-primary-900 w-64 focus:ring-2 ring-primary-900/10 transition-all" />
               </div>
            </div>
            <Button variant="outline" className="border-slate-100 text-slate-400 font-black">VIEW ALL RESIDENTS</Button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                     <th className="px-10 py-5">Full Name</th>
                     <th className="px-10 py-5">Society ID</th>
                     <th className="px-10 py-5">Flat No.</th>
                     <th className="px-10 py-5">Status</th>
                     <th className="px-10 py-5">Verified</th>
                     <th className="px-10 py-5"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {[
                    { name: 'Sarah Jenkins', sid: 'RP-082', flat: 'A-1204', status: 'Active' },
                    { name: 'Vikram Malhotra', sid: 'RP-085', flat: 'B-402', status: 'Pending' },
                    { name: 'Elena Rodriguez', sid: 'RP-102', flat: 'D-901', status: 'Active' },
                  ].map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-10 py-6 font-bold text-primary-900">{r.name}</td>
                       <td className="px-10 py-6 font-bold text-slate-400 text-sm tracking-widest">{r.sid}</td>
                       <td className="px-10 py-6 font-bold text-slate-500 text-sm">{r.flat}</td>
                       <td className="px-10 py-6">
                          <Badge variant={r.status === 'Active' ? 'success' : 'warning'}>{r.status}</Badge>
                       </td>
                       <td className="px-10 py-6">
                          <CheckCircle2 className={`w-5 h-5 ${r.status === 'Active' ? 'text-emerald-500' : 'text-slate-200'}`} />
                       </td>
                       <td className="px-10 py-6 text-right">
                          <button className="text-slate-300 hover:text-primary-900 transition-colors"><MoreVertical className="w-5 h-5" /></button>
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

export default AdminDashboard;
