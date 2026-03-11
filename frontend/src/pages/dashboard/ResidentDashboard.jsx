import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  MessageSquare, 
  Users, 
  Calendar, 
  Bell, 
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ResidentDashboard = () => {
  const [complaints, setComplaints] = useState([
    { id: 1, title: 'Elevator Maintenance', status: 'IN_PROGRESS', priority: 'HIGH', date: '2026-03-10' },
    { id: 2, title: 'Pool Cleaning', status: 'RESOLVED', priority: 'LOW', date: '2026-03-08' },
  ]);

  const stats = [
    { label: 'Pending Dues', value: '₹4,500', icon: CreditCard, color: 'gold' },
    { label: 'Gate Approvals', value: '12', icon: ShieldCheck, color: 'primary' },
    { label: 'Active Complaints', value: '2', icon: AlertCircle, color: 'emerald' },
    { label: 'Next Booking', value: 'Gym - 6 PM', icon: Calendar, color: 'gold' },
  ];

  const maintenanceData = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Monthly Water Usage (KL)',
      data: [12, 19, 15, 17, 14, 13],
      backgroundColor: '#FACC15',
    }]
  };

  return (
    <div className="p-10 space-y-12 bg-slate-50 min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary-900 tracking-tighter">Welcome, Sarah</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Royal Palms Residence • Penthouse A-1204</p>
        </div>
        <div className="flex gap-4">
           <Button className="bg-primary-900 text-white border-none px-8 font-black">PAY MAINTENANCE</Button>
           <Button variant="outline" className="border-slate-200 text-primary-900 font-black">RAISE COMPLAINT</Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <Card key={i} className="luxury-card p-8 group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 
              ${s.color === 'gold' ? 'bg-gold-500/10 text-gold-600' : ''}
              ${s.color === 'primary' ? 'bg-primary-900/10 text-primary-900' : ''}
              ${s.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : ''}
            `}>
              <s.icon className="w-7 h-7" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">{s.label}</p>
            <h3 className="text-3xl font-black text-primary-900 tracking-tighter">{s.value}</h3>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <Card className="luxury-card p-10 lg:col-span-2">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-primary-900 tracking-tighter">Resource Consumption</h3>
              <Badge variant="outline">Monthly Analytics</Badge>
           </div>
           <div className="h-[300px]">
              <Bar data={maintenanceData} options={{ responsive: true, maintainAspectRatio: false }} />
           </div>
        </Card>

        <Card className="luxury-card p-10">
           <h3 className="text-2xl font-black text-primary-900 tracking-tighter mb-8">Recent Notices</h3>
           <div className="space-y-6">
              {[
                { title: 'Annual General Meeting', date: 'March 15, 2026', tag: 'OFFICIAL' },
                { title: 'Water Tank Cleaning', date: 'March 12, 2026', tag: 'MAINTENANCE' },
                { title: 'Holi Celebrations', date: 'March 25, 2026', tag: 'CULTURAL' },
              ].map((n, i) => (
                <div key={i} className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
                   <div className="w-12 h-12 bg-white shadow-lg rounded-xl flex items-center justify-center text-elegant-gold group-hover:bg-elegant-gold group-hover:text-white transition-all">
                      <Bell className="w-6 h-6" />
                   </div>
                   <div>
                      <h5 className="font-bold text-primary-900 text-sm">{n.title}</h5>
                      <p className="text-xs text-slate-400 mt-1">{n.date}</p>
                   </div>
                </div>
              ))}
           </div>
           <Button variant="outline" className="w-full mt-10 border-slate-100 text-elegant-gold font-black">VIEW ALL NOTICES</Button>
        </Card>
      </div>

      {/* Complaints Table */}
      <Card className="luxury-card overflow-hidden">
         <div className="p-10 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-2xl font-black text-primary-900 tracking-tighter">My Complaints</h3>
            <button className="text-sm font-black text-elegant-gold uppercase tracking-widest hover:text-gold-600">Track Status</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                     <th className="px-10 py-5">Issue Title</th>
                     <th className="px-10 py-5">Status</th>
                     <th className="px-10 py-5">Priority</th>
                     <th className="px-10 py-5">Reported On</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {complaints.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-10 py-6 font-bold text-primary-900">{c.title}</td>
                       <td className="px-10 py-6">
                          <Badge variant={c.status === 'RESOLVED' ? 'success' : 'warning'}>
                             {c.status.replace('_', ' ')}
                          </Badge>
                       </td>
                       <td className="px-10 py-6 font-bold text-slate-500 text-sm">{c.priority}</td>
                       <td className="px-10 py-6 text-slate-400 font-medium">{c.date}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
};

export default ResidentDashboard;
